/*
 * puertoQueryValidator.js - Validador de consultas para Puertos
 * Genera el esquema de validación para parámetros de búsqueda y filtrado de puertos
 */

const queryValidator = require("./queryValidator");
const { puerto } = require("../models");

/**
 * Esquema de validación para consultas sobre el modelo 'puerto'
 * 
 * Utiliza la lógica centralizada para validar:
 * - Filtros dinámicos (nombre, ciudad, etc.)
 * - Paginación (limit, offset)
 * - Ordenamiento
 * 
 * @type {Joi.ObjectSchema}
 */
const puertoQueryValidator = queryValidator(puerto);
module.exports = puertoQueryValidator;