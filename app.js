const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Rutas del API
const puertoRoutes = require("./routes/puertoRoutes.js");
const muelleRoutes = require("./routes/muelleRoutes.js");

// Middleware global para manejo de errores (captura errores y responde JSON)
const errorHandler = require("./middleware/errorHandler.js");

// Inicialización de la aplicación y puerto de escucha
const app = express();

// Parsers y middlewares globales
// Seguridad HTTP básica
app.use(helmet());

// Límite de tasa para prevenir abusos (100 peticiones por minuto)
app.use(rateLimit({ windowMs: 60000, max: 100 }));

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

module.exports = app;