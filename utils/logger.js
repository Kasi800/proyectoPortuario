/*
 * logger.js - Sistema centralizado de logging
 * Usa Winston si está disponible, con fallback a console
 */

// ============================================================
// INICIALIZACIÓN DEL LOGGER
// ============================================================

let logger = null;

try {
  // Intentar cargar Winston
  const winston = require('winston');
  logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    transports: [new winston.transports.Console()]
  });
} catch (e) {
  // Fallback: si Winston no está instalado, usar console con timestamp
  logger = {
    info: (...args) => console.log(new Date().toISOString(), ...args),
    error: (...args) => console.error(new Date().toISOString(), ...args),
    debug: (...args) => console.debug(new Date().toISOString(), ...args),
    warn: (...args) => console.warn(new Date().toISOString(), ...args)
  };
}

// ============================================================
// FUNCIONES DE LOGGING
// ============================================================

/**
 * Registra un mensaje informativo
 * @param {...any} args - Argumentos a registrar
 */
function logMensaje(...args) {
  logger.info(...args);
}

/**
 * Registra un mensaje de error
 * @param {...any} args - Argumentos a registrar
 */
function logError(...args) {
  logger.error(...args);
}

/**
 * Registra un mensaje de advertencia
 * @param {...any} args - Argumentos a registrar
 */
function logWarn(...args) {
  logger.warn(...args);
}

/**
 * Registra errores de SQL de forma estructurada
 * Extrae información útil de errores MySQL/MariaDB
 * @param {Error} err - Error de la base de datos
 */
function logErrorSQL(err) {
  logger.error('Error de MySQL:', {
    code: err && err.code,
    errno: err && err.errno,
    sqlMessage: err && err.sqlMessage,
    sqlState: err && err.sqlState
  });
}

module.exports = { logMensaje, logError, logErrorSQL, logWarn, logger };