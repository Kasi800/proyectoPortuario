const Joi = require("joi");
const orderValidator = require("./orderValidator");
const filterValidator = require("./filterValidator");

/**
 * Validador de parámetros de consulta para listados.
 *
 * Construye un esquema Joi que combina:
 * - Parámetros de paginación (`limit`, `offset`).
 * - Parámetro de ordenación (`order`) validado por `orderValidator`.
 * - Filtros dinámicos derivados del modelo Sequelize mediante `filterValidator`.
 *
 * El resultado no permite claves desconocidas (`unknown(false)`).
 *
 * @param {Object} model - Modelo Sequelize (se usa `model.rawAttributes`)
 * @returns {Joi.Schema} Esquema Joi para validar query params
 */
function queryValidator(model) {
    // Campos permitidos extraídos del modelo
    const allowedFields = Object.keys(model.rawAttributes);

    // Esquema base para paginación y orden
    return Joi.object({
        limit: Joi.number().integer().min(1).max(1000).optional(),
        offset: Joi.number().integer().min(0).optional(),
        order: orderValidator(allowedFields).optional(),
    })
        // Añadir filtros basados en los atributos del modelo
        .concat(filterValidator(model))
        // No permitir claves adicionales fuera del esquema
        .unknown(false);
}

module.exports = queryValidator;