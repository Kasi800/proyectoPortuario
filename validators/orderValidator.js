const Joi = require("joi");

function orderValidator(allowedFields) {
    return Joi.string()
        .pattern(/^[a-zA-Z_]+:(asc|desc)$/i)
        .custom((value, helpers) => {
            const [campo] = value.split(":");
            if (!allowedFields.includes(campo)) {
                return helpers.error("any.invalid");
            }
            return value;
        }, "Order field validation");
}

module.exports = orderValidator;