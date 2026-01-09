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

function logMensaje(...args) {
  logger.info(...args);
}

function logErrorSQL(err) {
  logger.error('Error de MySQL:', {
    code: err && err.code,
    errno: err && err.errno,
    sqlMessage: err && err.sqlMessage,
    sqlState: err && err.sqlState
  });
}

module.exports = { logMensaje, logErrorSQL, logger };