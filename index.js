// ============================================
// IMPORTACIONES
// ============================================

// Framework web minimalista para crear la API y el servidor HTTP
const express = require("express");
// Utilidades para manejar rutas y unir rutas de archivos del sistema
const path = require("path");
// Middleware para habilitar CORS (Cross-Origin Resource Sharing)
const cors = require("cors");
// Función de logging personalizada
const { logMensaje } = require("./utils/logger.js");

// Importamos los módulos de rutas. Se espera que exporten un `express.Router()`
const puertoRoutes = require("./routes/puertoRoutes.js");
const muelleRoutes = require("./routes/muelleRoutes.js");
// Middleware de manejo de errores centralizado
const errorHandler = require("./middleware/errorHandler.js");

// ============================================
// INICIALIZACIÓN
// ============================================

// Creamos la instancia de Express que manejará las rutas y middleware
const app = express();
// Puerto configurable mediante la variable de entorno `PORT`, por defecto 3000
const port = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE - PARSEO
// ============================================

// Permite que Express entienda payloads JSON en el body de las peticiones
app.use(express.json());

// ============================================
// MIDDLEWARE - CORS
// ============================================

// Habilita CORS para permitir peticiones desde otros orígenes.
// Actualmente está abierto a cualquier origen.
app.use(cors());

// ============================================
// MIDDLEWARE - ARCHIVOS ESTÁTICOS
// ============================================

// Sirve recursos estáticos (HTML, CSS, JS, imágenes) desde la carpeta `public`.
app.use(express.static(path.join(__dirname, "public")));

// ============================================
// RUTAS - API REST
// ============================================

// Montamos los routers importados bajo los prefijos indicados.
app.use("/api/puertos", puertoRoutes);
app.use("/api/muelles", muelleRoutes);

// ============================================
// RUTAS - SPA (Catch-all)
// ============================================

// Cualquier ruta no manejada por los routers anteriores servirá el archivo
app.get("/*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ============================================
// SERVIDOR
// ============================================

// Registrar middleware de manejo de errores (debe ir después de las rutas)
app.use(errorHandler);

// Arranca el servidor HTTP y loguea su estado mediante `logMensaje`.
app.listen(port, () => {
    logMensaje(`Servidor escuchando en el puerto ${port}`);
});
