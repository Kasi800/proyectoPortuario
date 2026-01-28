/*
 * errorHandler.js - Middleware centralizado de manejo de errores
 * Captura, registra y formatea errores de toda la aplicación
 */

const { logError, logErrorSQL, logWarn } = require('../utils/logger.js');

// ============================================================
// MIDDLEWARE DE ERROR
// ============================================================

/**
 * Middleware centralizado para manejo de errores
 * Captura excepciones, las registra y envía respuesta JSON
 * 
 * Clasifica errores en tres tipos:
 * - Errores SQL: registra detalles técnicos de BD
 * - Errores de cliente (4xx): registra como advertencia
 * - Otros errores (5xx): registra con stack trace
 * 
 * @param {Error} err - Objeto de error capturado
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Siguiente middleware
 * @returns {void}
 * 
 * @example
 * app.use(errorHandler); // Debe ser el último middleware
 */
module.exports = (err, req, res, next) => {
  // Extraer estado y mensaje del error (valores por defecto)
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';

  // Construir metadatos del error para logging
  const meta = {
    status,
    message,
    path: req.originalUrl,    // Ruta solicitada
    method: req.method         // Método HTTP usado
  };

  // Clasificar error y registrarlo apropiadamente
  if (err.code && err.sqlMessage) {
    // Error de BD: registrar detalles SQL
    logErrorSQL(err, meta);
  } else if (status >= 400 && status < 500) {
    // Error del cliente: registrar como advertencia
    logWarn('Client error:', meta);
  } else {
    // Error del servidor: registrar con stack trace
    logError('Error HTTP:', { ...meta, stack: err.stack || null });
  }

  // Enviar respuesta JSON al cliente
  res.status(status).json({ 
    ok: false, 
    data: null, 
    message: message 
  });
};
