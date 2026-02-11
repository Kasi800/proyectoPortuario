/*
 * puertoBodyValidator.js - Esquemas de validación para Puertos
 * Define las reglas de integridad para la creación y edición de puertos
 */

const Joi = require("joi");

// ============================================================
// ESQUEMAS DE VALIDACIÓN (JOI)
// ============================================================

/**
 * Esquema completo para Puerto (POST / PUT)
 * Valida que todos los campos obligatorios cumplan con los requisitos de negocio
 */
const puertoSchemaFull = Joi.object({
    nombre: Joi.string().min(2).max(100).required(),
    ciudad: Joi.string().min(2).max(100).required(),
    pais: Joi.string().min(2).max(100).required(),
    capacidad_teu: Joi.number().integer().min(0).required(),
    activo: Joi.boolean().required(),
    fecha_inauguracion: Joi.date().required(),
    profundidad_media: Joi.number().min(0).max(999.99).required()
}).unknown(false); // No permite campos extra fuera del esquema

/**
 * Esquema parcial para Puerto (PATCH)
 * Reutiliza el esquema completo permitiendo actualizaciones parciales
 * Requiere que se envíe al menos un campo para que la petición sea válida
 */
const puertoSchemaPartial = puertoSchemaFull.fork(
    Object.keys(puertoSchemaFull.describe().keys),
    (schema) => schema.optional()
).min(1);

module.exports = {
    puertoSchemaFull,
    puertoSchemaPartial
};