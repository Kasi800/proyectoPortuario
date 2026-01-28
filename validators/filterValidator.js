/*
 * filterValidator.js - Generador dinámico de validaciones para filtros
 * Crea esquemas Joi basados en la estructura de los modelos de Sequelize
 */

const Joi = require("joi");

// ============================================================
// GENERADOR DE ESQUEMAS DE FILTRADO
// ============================================================

/**
 * Construye un validador Joi dinámico basado en los atributos de un modelo
 * 
 * Funcionalidades:
 * - Mapeo automático: Convierte tipos de Sequelize (INT, DATE, etc.) a tipos Joi
 * - Rangos: Crea automáticamente campos _min y _max para tipos numéricos y fechas
 * - Validación lógica: Verifica que los valores mínimos no superen a los máximos
 * - Seguridad: Bloquea cualquier parámetro no definido en el modelo (unknown: false)
 * 
 * @param {Object} model - Modelo de Sequelize a inspeccionar
 * @returns {Joi.ObjectSchema} Esquema Joi configurado
 */
function filterValidator(model) {
    // Campos permitidos a partir de la definición del modelo
    const allowed = Object.keys(model.rawAttributes);
    // Forma del esquema Joi que iremos construyendo dinámicamente
    const schemaShape = {};

    // Mapear tipos de datos del modelo a reglas de Joi
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
                // Por defecto tratar como string (búsquedas parciales)
                schemaShape[field] = Joi.string();
                break;
        }
    }

    // Retornar objeto Joi con lógica de validación cruzada para rangos
    return Joi.object(schemaShape)
        .custom((value, helpers) => {
            for (const field of allowed) {
                const min = value[`${field}_min`];
                const max = value[`${field}_max`];

                // Validar que el rango sea coherente
                if (min !== undefined && max !== undefined && min > max) {
                    return helpers.error("any.invalid", { message: `${field}_min no puede ser mayor que ${field}_max` });
                }
            }
            return value;
        })
        .unknown(false); // No permitir campos ajenos al modelo
}

module.exports = filterValidator;