/*
 * validateBody.js - Middleware de validación de body
 * Valida y limpia el cuerpo de las solicitudes entrantes usando Joi
 */

const ApiError = require("../utils/ApiError");

// ============================================================
// MIDDLEWARE DE VALIDACIÓN DE BODY
// ============================================================

/**
 * Middleware para validar el req.body contra un esquema Joi
 * 
 * Funcionalidades clave:
 * - abortEarly (false): Captura todos los errores, no solo el primero
 * - stripUnknown (true): Elimina propiedades no definidas en el esquema
 * - Sanitización: Reemplaza req.body con el valor validado/limpio
 * 
 * @param {Object} schema - Esquema de validación (Joi)
 * @returns {Function} Middleware de Express (req, res, next)
 * 
 * @example
 * router.post('/login', validate(loginSchema), authController.login);
 */
module.exports = (schema) => (req, res, next) => {
    // Validar el cuerpo de la petición
    const { error, value } = schema.validate(req.body, {
        abortEarly: false, // Reporta todos los errores encontrados
        stripUnknown: true // Limpia campos sobrantes por seguridad
    });
    if (error) {
        // Lanza error 400 si la validación falla
        return next(new ApiError("Invalid request data", 400));
    }

    // Sobrescribir req.body con los datos validados y limpios
    req.body = value;
    next();
};