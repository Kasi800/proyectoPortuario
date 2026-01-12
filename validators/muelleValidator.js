const Joi = require("joi");

// Validación (POST y PUT)
const muelleSchemaFull = Joi.object({
    id_puerto: Joi.number().integer().min(1).required(),
    nombre: Joi.string().min(2).max(100).required(),
    longitud_m: Joi.number().min(0).required(),
    calado_m: Joi.number().min(0).required(),
    operativo: Joi.boolean().required(),
    fecha_construccion: Joi.date().required(),
    tipo: Joi.string().valid("carga", "pasajeros", "mixto").required()
});

// Validación parcial (PATCH)
const muelleSchemaPartial = muelleSchemaFull.fork(
    Object.keys(muelleSchemaFull.describe().keys),
    (schema) => schema.optional()
);

module.exports = {
    muelleSchemaFull,
    muelleSchemaPartial
};