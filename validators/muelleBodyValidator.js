const Joi = require("joi");

/**
 * Esquema Joi para validación de cuerpos `muelle`.
 *
 * - `muelleSchemaFull`: para `POST` y `PUT` (todos los campos requeridos).
 * - `muelleSchemaPartial`: para `PATCH` (campos opcionales, mínimo 1).
 *
 * Campos principales:
 * - `id_puerto`: referencia al puerto (entero >=1).
 * - `nombre`: string descriptivo.
 * - `longitud_m`, `calado_m`: medidas numéricas >= 0.
 * - `operativo`: booleano que indica estado operativo.
 * - `fecha_construccion`: fecha válida.
 * - `tipo`: enum restringido a `carga`, `pasajeros` o `mixto`.
 */

// Validación (POST y PUT) - todos los campos requeridos
const muelleSchemaFull = Joi.object({
    id_puerto: Joi.number().integer().min(1).required(),
    nombre: Joi.string().min(2).max(100).required(),
    longitud_m: Joi.number().min(0).required(),
    calado_m: Joi.number().min(0).required(),
    operativo: Joi.boolean().required(),
    fecha_construccion: Joi.date().required(),
    tipo: Joi.string().valid("carga", "pasajeros", "mixto").required()
});

// Validación parcial (PATCH) - todas las claves opcionales y al menos una
const muelleSchemaPartial = muelleSchemaFull.fork(
    Object.keys(muelleSchemaFull.describe().keys),
    (schema) => schema.optional()
).min(1);

module.exports = {
    muelleSchemaFull,
    muelleSchemaPartial
};