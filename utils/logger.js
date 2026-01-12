/**
 * Logger centralizado con soporte para `winston` si está disponible.
 *
 * - Intenta cargar `winston` y configurar un logger JSON con timestamps.
 * - Si `winston` no está instalado, proporciona un fallback que escribe
 *   a `console` incluyendo la marca de tiempo. Esto evita fallos en
 *   entornos de desarrollo donde winston no se haya instalado.
 */
let logger = null;
try {
  const winston = require('winston');
  logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    transports: [new winston.transports.Console()]
  });
} catch (e) {
  // Winston no disponible — usar fallback console
  logger = {
    info: (...args) => console.log(new Date().toISOString(), ...args),
    error: (...args) => console.error(new Date().toISOString(), ...args),
    debug: (...args) => console.debug(new Date().toISOString(), ...args)
  };
}

/**
 * Registrar un mensaje informativo.
 * @param  {...any} args
 */
function logMensaje(...args) {
  logger.info(...args);
}

/**
 * Registrar errores SQL de forma estructurada para facilitar el diagnóstico.
 * Extrae campos comunes de errores de MySQL/MariaDB.
 * @param {Error} err
 */
function logErrorSQL(err) {
  logger.error('Error de MySQL:', {
    code: err && err.code,
    errno: err && err.errno,
    sqlMessage: err && err.sqlMessage,
    sqlState: err && err.sqlState
  });
}

module.exports = { logMensaje, logErrorSQL, logger };