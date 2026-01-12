const { logMensaje } = require('../utils/logger.js');

module.exports = (err, req, res, next) => {
  const status = err && err.status ? err.status : 500;
  const message = err && err.message ? err.message : 'Error interno del servidor';
  try {
    logMensaje('Error HTTP:', status, message, err && err.stack ? err.stack : null);
  } catch (e) {
    console.error('Log error:', e);
  }
  res.status(status).json({ ok: false, data: null, message: message });
};
