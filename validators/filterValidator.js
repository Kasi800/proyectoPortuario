const Joi = require("joi");

/**
 * Construye y devuelve un validador Joi dinámico para los filtros
 * basados en los atributos (`rawAttributes`) de un modelo Sequelize.
 *
 * Uso: validar query params recibidos para búsquedas/filtrado antes
 * de pasarlos al servicio.
 *
 * Nota: el validador no permite claves desconocidas (`unknown(false)`).
 * 
 * @param {Object} model - Modelo Sequelize (se usa `model.rawAttributes`)
 * @returns {Joi.Schema} Esquema Joi para validar filtros
 */
function filterValidator(model) {
    // Campos permitidos a partir de la definición del modelo
    const allowed = Object.keys(model.rawAttributes);

    // Forma del esquema Joi que iremos construyendo dinámicamente
    const schemaShape = {};

    // Mapear tipos Sequelize a validadores Joi apropiados
    for (const field of allowed) {
        const attr = model.rawAttributes[field];

        // `attr.type.constructor.key` contiene la clave del tipo (ej. INTEGER, STRING)
        switch (attr.type.constructor.key) {
            case "INTEGER":
                schemaShape[field] = Joi.number().integer();
                schemaShape[`${field}_min`] = Joi.number().integer();
                schemaShape[`${field}_max`] = Joi.number().integer();
                break;
            case "FLOAT":
            case "DOUBLE":
            case "DECIMAL":
                schemaShape[field] = Joi.number();
                schemaShape[`${field}_min`] = Joi.number();
                schemaShape[`${field}_max`] = Joi.number();
                break;
            case "BOOLEAN":
                schemaShape[field] = Joi.boolean();
                break;
            case "DATE":
            case "DATEONLY":
                schemaShape[field] = Joi.date();
                schemaShape[`${field}_min`] = Joi.date();
                schemaShape[`${field}_max`] = Joi.date();
                break;
            default:
                schemaShape[field] = Joi.string();
                break;
        }
    }

    // Devolver un objeto Joi que valide exclusivamente las claves definidas
    return Joi.object(schemaShape)
        .custom((value, helpers) => {
            for (const field of allowed) {
                const min = value[`${field}_min`];
                const max = value[`${field}_max`];

                if (min !== undefined && max !== undefined && min > max) {
                    return helpers.error("any.invalid", { message: `${field}_min no puede ser mayor que ${field}_max` });
                }
            }
            return value;
        })
        .unknown(false);
}

module.exports = filterValidator;