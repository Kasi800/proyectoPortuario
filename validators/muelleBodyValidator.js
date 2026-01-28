/*
 * muelleBodyValidator.js - Esquemas de validación para Muelles
 * Define las reglas de integridad para la creación y edición de muelles
 */

const Joi = require("joi");

// ============================================================
// ESQUEMAS DE VALIDACIÓN (JOI)
// ============================================================

/**
 * Esquema completo para Muelle (POST / PUT)
 * Valida que todos los campos obligatorios cumplan con el formato técnico
 */
const muelleSchemaFull = Joi.object({
    id_puerto: Joi.number().integer().min(1).required(),
    nombre: Joi.string().min(2).max(100).required(),
    longitud_m: Joi.number().min(0).required(),
    calado_m: Joi.number().min(0).required(),
    operativo: Joi.boolean().required(),
    fecha_construccion: Joi.date().required(),
    tipo: Joi.string().valid("carga", "pasajeros", "granel").required()
}).unknown(false); // No permite campos extra fuera del esquema

/**
 * Esquema parcial para Muelle (PATCH)
 * Reutiliza el esquema completo pero marca todos los campos como opcionales
 * Requiere que al menos se envíe un campo para procesar la actualización
 */
const muelleSchemaPartial = muelleSchemaFull.fork(
    Object.keys(muelleSchemaFull.describe().keys),
    (schema) => schema.optional()
).min(1);

module.exports = {
    muelleSchemaFull,
    muelleSchemaPartial
};