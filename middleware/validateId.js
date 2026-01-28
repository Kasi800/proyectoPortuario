/*
 * validateId.js - Middleware de validación de parámetros de ruta
 * Asegura que los identificadores recibidos en la URL sean válidos
 */

const idValidator = require("../validators/idValidator");

// ============================================================
// MIDDLEWARE DE VALIDACIÓN DE ID
// ============================================================

/**
 * Middleware para validar identificadores numéricos en la URL
 * Utiliza el validador centralizado para verificar enteros positivos
 * 
 * @param {string} [paramName='id'] - Nombre del parámetro a validar en req.params
 * @returns {Function} Middleware de Express para validación de ID
 * 
 * @example
 * router.get('/:userId', validateId('userId'), userController.getById);
 */
function validateId(paramName = 'id') {
    return (req, res, next) => {
        try {
            // Ejecutar validación sobre el parámetro específico
            idValidator(req.params[paramName]);
            next();
        } catch (err) {
            // Pasar el error de validación al manejador centralizado
            next(err);
        }
    };
};
module.exports = validateId;
