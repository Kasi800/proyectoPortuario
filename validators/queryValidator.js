const Joi = require("joi");
const orderValidator = require("./orderValidator");
const filterValidator = require("./filterValidator");

function queryValidator(model) {
    const allowedFields = Object.keys(model.rawAttributes);

    return Joi.object({
        limit: Joi.number().integer().min(1).max(1000).optional(),
        offset: Joi.number().integer().min(0).optional(),
        order: orderValidator(allowedFields).optional(),
    })
        .concat(filterValidator(model))
        .unknown(false);
}

module.exports = queryValidator;