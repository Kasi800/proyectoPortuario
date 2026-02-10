/*
 * validateQuery.js - Middleware de validación de parámetros de consulta
 * Valida y sanitiza los parámetros GET (query string) mediante esquemas Joi
 */

const ApiError = require("../utils/ApiError");

// ============================================================
// MIDDLEWARE DE VALIDACIÓN DE QUERY
// ============================================================

/**
 * Middleware para validar req.query contra un esquema específico
 * 
 * Funcionalidades clave:
 * - Sanitización: Elimina parámetros no permitidos (stripUnknown)
 * - Integridad: Valida tipos de datos y restricciones antes de llegar al controlador
 * - Normalización: Sobrescribe req.query con los valores procesados
 * 
 * @param {Object} schema - Esquema Joi para validar los parámetros de búsqueda
 * @returns {Function} Middleware de Express (req, res, next)
 * 
 * @example
 * router.get('/search', validateQuery(searchSchema), controller.search);
 */
module.exports = (schema) => (req, res, next) => {
    // Validar los parámetros de la URL (?param=value)
    const { error, value } = schema.validate(req.query, {
        abortEarly: false, // Captura todos los errores de validación
        stripUnknown: true // Descarta parámetros extra no definidos
    });

    if (error) {
        // Interrumpe la petición con un error 400 si la validación falla
        return next(new ApiError("Invalid query parameters", 400, error.details));
    }

    // Actualiza req.query con los datos limpios y tipados
    req.query = value;
    next();
};