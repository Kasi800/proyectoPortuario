const Joi = require("joi");

function filterValidator(model) {
    const allowed = Object.keys(model.rawAttributes);

    const schemaShape = {};

    for (const field of allowed) {
        const attr = model.rawAttributes[field];

        if (attr.type.constructor.key === "INTEGER") {
            schemaShape[field] = Joi.number().integer();
        } else if (attr.type.constructor.key === "FLOAT" || attr.type.constructor.key === "DOUBLE") {
            schemaShape[field] = Joi.number();
        } else if (attr.type.constructor.key === "BOOLEAN") {
            schemaShape[field] = Joi.boolean();
        } else if (attr.type.constructor.key === "DATE") {
            schemaShape[field] = Joi.date();
        } else {
            schemaShape[field] = Joi.string();
        }
    }

    return Joi.object(schemaShape).unknown(false);
}

module.exports = filterValidator;