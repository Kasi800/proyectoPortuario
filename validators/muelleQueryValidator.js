/*
 * muelleQueryValidator.js - Validador de consultas para Muelles
 * Genera el esquema de validación para parámetros de búsqueda (filtros, paginación, orden)
 */

const queryValidator = require("./queryValidator");
const { muelle } = require("../models");

/**
 * Esquema de validación para consultas sobre el modelo 'muelle'
 * 
 * Basándose en la definición del modelo, permite validar:
 * - Filtros dinámicos (nombre, tipo, etc.)
 * - Paginación (limit, offset)
 * - Ordenamiento
 * 
 * @type {Joi.ObjectSchema}
 */
const muelleQueryValidator = queryValidator(muelle);

module.exports = muelleQueryValidator;