/*
 * config.js - Configuración centralizada de la aplicación
 * Carga variables de entorno y proporciona valores por defecto
 */

// ============================================================
// CARGAR VARIABLES DE ENTORNO
// ============================================================

// Cargar archivo .env en la raíz del proyecto
require("dotenv").config({
  path: `.env`,
});

// ============================================================
// CONFIGURACIÓN DE LA APLICACIÓN
// ============================================================

module.exports = {
  // Puerto del servidor (por defecto 3000)
  port: process.env.PORT || 3000,
  node_env: process.env.NODE_ENV || "development",

  // Configuración de la base de datos
  db: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "test",
    name: process.env.DB_NAME || "infraestructura_portuaria",
    port: process.env.DB_PORT || 3306,
  }
};