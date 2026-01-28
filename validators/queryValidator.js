/*
 * queryValidator.js - Validador global de consultas (Query Strings)
 * Combina paginación, ordenamiento y filtrado dinámico en un solo esquema
 */

const Joi = require("joi");
const orderValidator = require("./orderValidator");
const filterValidator = require("./filterValidator");

// ============================================================
// GENERADOR DE ESQUEMAS DE CONSULTA
// ============================================================

/**
 * Construye un esquema Joi integral para peticiones de listado (GET)
 * 
 * Componentes del esquema:
 * - Paginación: Controla 'limit' (1-1000) y 'offset' (>=0)
 * - Orden: Integra orderValidator para validar 'campo:dirección'
 * - Filtros: Integra filterValidator para mapear atributos del modelo
 * - Seguridad: Bloquea cualquier parámetro no reconocido (unknown: false)
 * 
 * @param {Object} model - Modelo de Sequelize para extraer atributos
 * @returns {Joi.ObjectSchema} Esquema Joi completo para req.query
 */
function queryValidator(model) {
    // Obtener columnas permitidas del modelo para el ordenamiento
    const allowedFields = Object.keys(model.rawAttributes);

    // Definir base de paginación y orden
    const baseSchema = Joi.object({
        limit: Joi.number().integer().min(1).max(1000).optional(),
        offset: Joi.number().integer().min(0).optional(),
        order: orderValidator(allowedFields).optional(),
    })
    
    // Unir base con filtros dinámicos y restringir claves desconocidas
    return baseSchema
        .concat(filterValidator(model))
        .unknown(false);
}

module.exports = queryValidator;