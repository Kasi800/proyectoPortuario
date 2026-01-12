const express = require("express");
const path = require("path");
const cors = require("cors");

// Logger personalizado
const { logMensaje } = require("./utils/logger.js");

// Rutas del API
const puertoRoutes = require("./routes/puertoRoutes.js");
const muelleRoutes = require("./routes/muelleRoutes.js");

// Middleware global para manejo de errores (captura errores y responde JSON)
const errorHandler = require("./middleware/errorHandler.js");

// Inicialización de la aplicación y puerto de escucha
const app = express();
const port = process.env.PORT || 3000;

// Parsers y middlewares globales
// Permite recibir cuerpos JSON en las peticiones
app.use(express.json());

// Habilita CORS con configuración por defecto
app.use(cors());

// Servir archivos estáticos desde la carpeta `public`
app.use(express.static(path.join(__dirname, "public")));

// Montaje de rutas API
app.use("/api/puertos", puertoRoutes);
app.use("/api/muelles", muelleRoutes);

// Enrutado de SPA: devolver `index.html` para rutas no gestionadas por la API
app.get("/*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Middleware de manejo centralizado de errores
app.use(errorHandler);

// Arranque del servidor
app.listen(port, () => {
    logMensaje(`Servidor escuchando en el puerto ${port}`);
});
