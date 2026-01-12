const Joi = require("joi");

/**
 * Esquema Joi para validación de cuerpos `puerto`.
 *
 * - `puertoSchemaFull`: usado para `POST` y `PUT` (todos los campos requeridos).
 * - `puertoSchemaPartial`: usado para `PATCH` (campos opcionales, mínimo 1).
 *
 * Campos principales:
 * - `nombre`, `ciudad`, `pais`: strings entre 2 y 100 caracteres.
 * - `capacidad_teu`: entero >= 0.
 * - `activo`: booleano.
 * - `fecha_inauguracion`: fecha válida.
 * - `profundidad_media`: número >= 0.
 */

// Validación (POST y PUT) - todos los campos requeridos
const puertoSchemaFull = Joi.object({
    nombre: Joi.string().min(2).max(100).required(),
    ciudad: Joi.string().min(2).max(100).required(),
    pais: Joi.string().min(2).max(100).required(),
    capacidad_teu: Joi.number().integer().min(0).required(),
    activo: Joi.boolean().required(),
    fecha_inauguracion: Joi.date().required(),
    profundidad_media: Joi.number().min(0).required()
});

// Validación parcial (PATCH) - todas las claves opcionales y al menos una
const puertoSchemaPartial = puertoSchemaFull.fork(
    Object.keys(puertoSchemaFull.describe().keys),
    (schema) => schema.optional()
).min(1);

module.exports = {
    puertoSchemaFull,
    puertoSchemaPartial
};