const Joi = require("joi");

// Validación (POST y PUT)
const puertoSchemaFull = Joi.object({
    nombre: Joi.string().min(2).max(100).required(),
    ciudad: Joi.string().min(2).max(100).required(),
    pais: Joi.string().min(2).max(100).required(),
    capacidad_teu: Joi.number().integer().min(0).required(),
    activo: Joi.boolean().required(),
    fecha_inauguracion: Joi.date().required(),
    profundidad_media: Joi.number().min(0).required()
});

// Validación parcial (PATCH)
const puertoSchemaPartial = puertoSchemaFull.fork(
    Object.keys(puertoSchemaFull.describe().keys),
    (schema) => schema.optional()).min(1);

module.exports = {
    puertoSchemaFull,
    puertoSchemaPartial
};