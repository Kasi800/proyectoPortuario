const { logError, logErrorSQL, logWarn } = require('../utils/logger.js');

module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';

  const meta = {
    status,
    message,
    path: req.originalUrl,
    method: req.method
  };

  if (err.code && err.sqlMessage) {
    logErrorSQL(err, meta);
  } else if (status >= 400 && status < 500) {
    logWarn('Client error:', meta);
  } else {
    logError('Error HTTP:', { ...meta, stack: err.stack || null });
  }

  res.status(status).json({ ok: false, data: null, message: message });
};
