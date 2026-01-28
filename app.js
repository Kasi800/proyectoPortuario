/*
 * app.js - Configuración de la aplicación Express
 * Define middlewares, rutas y manejo de errores centralizado
 */

const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Rutas de la API
const puertoRoutes = require("./routes/puertoRoutes.js");
const muelleRoutes = require("./routes/muelleRoutes.js");

// Middleware centralizado de manejo de errores
const errorHandler = require("./middleware/errorHandler.js");

// Crear instancia de Express
const app = express();

// ============================================================
// MIDDLEWARES DE SEGURIDAD Y PROTECCIÓN
// ============================================================

// Configurar headers de seguridad HTTP
app.use(helmet());

// Limitar tasa de peticiones (100 por minuto) para prevenir abusos
app.use(rateLimit({ windowMs: 60000, max: 100 }));

// ============================================================
// PARSERS Y MIDDLEWARES DE DATOS
// ============================================================

// Parsear cuerpos JSON en las peticiones
app.use(express.json());

// Habilitar CORS para peticiones desde otros orígenes
app.use(cors());

// ============================================================
// SERVIR ARCHIVOS ESTÁTICOS
// ============================================================

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, "public")));

// ============================================================
// RUTAS DE LA API
// ============================================================

// Rutas para gestión de puertos
app.use("/api/puertos", puertoRoutes);

// Rutas para gestión de muelles
app.use("/api/muelles", muelleRoutes);

// ============================================================
// MANEJO DE RUTAS NO ENCONTRADAS
// ============================================================

// Responder 404 para endpoints de API inexistentes
app.use("/api/*splat", (req, res) => {
    res.status(404).json({ ok: false, data: null, message: "API Endpoint not found" });
});

// ============================================================
// ENRUTADO SPA
// ============================================================

// Servir index.html para rutas no gestionadas por la API (Single Page App)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ============================================================
// MIDDLEWARE DE ERROR GLOBAL
// ============================================================

// Capturar y procesar errores de toda la aplicación
app.use(errorHandler);

module.exports = app;