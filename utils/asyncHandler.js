/*
 * asyncHandler.js - Wrapper para manejo de errores en funciones async
 * Permite usar async/await en rutas sin necesidad de try-catch explícito
 */

// ============================================================
// FUNCIÓN ENVOLVENTE PARA ASYNC
// ============================================================

/**
 * Wrapper que captura errores en funciones async
 * y los envía al middleware de errores
 * 
 * @param {Function} fn - Función async del controlador
 * @returns {Function} Middleware que maneja la ejecución
 * 
 * @example
 * router.get('/', asyncHandler(async (req, res) => {
 *   const data = await db.query();
 *   res.json(data);
 * }));
 */
module.exports = fn => (req, res, next) => {
  try {
    // Envolver promesa y capturar rechazos
    Promise.resolve(fn(req, res, next)).catch(next);
  } catch (err) {
    // Pasar errores síncronos al middleware de errores
    next(err);
  }
};
