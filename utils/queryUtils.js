/*
 * queryUtils.js - Utilidades para construcción de queries Sequelize
 * Procesa parámetros HTTP y construye filtros para la BD
 */

const { Op } = require("sequelize");

// ============================================================
// FUNCIONES DE UTILIDAD
// ============================================================

/**
 * Convierte una cadena a su tipo primitivo más apropiado
 * 
 * Transformaciones:
 * - "true" -> true
 * - "false" -> false
 * - Números -> Number
 * - Otros -> string
 * 
 * @param {string} value - Valor a parsear
 * @returns {string|number|boolean} Valor convertido
 */
function parseValue(value) {
    if (value === "true") return true;
    if (value === "false") return false;
    // Detectar números (enteros y flotantes, positivos y negativos)
    if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number(value);
    return value;
}

/**
 * Obtiene los campos permitidos de un modelo Sequelize
 * Devuelve array vacío si el modelo es inválido
 * 
 * @param {Object} modelo - Modelo Sequelize
 * @returns {string[]} Array de nombres de campos
 */
function getAllowedFields(modelo) {
    try {
        return Object.keys(modelo?.rawAttributes ? modelo.rawAttributes : {});
    } catch (e) {
        return [];
    }
}

/**
 * Construye un objeto de consulta compatible con Sequelize
 * a partir de parámetros HTTP
 * 
 * Parámetros especiales:
 * - limit: máximo 1000 (por defecto 100)
 * - offset: entero >= 0 (por defecto 0)
 * - order: formato "campo:direccion" (ej: "nombre:desc")
 * - campo_min, campo_max: rango de valores
 * 
 * @param {Object} queryParams - Parámetros de consulta HTTP
 * @param {Object} modelo - Modelo Sequelize
 * @returns {Object} {where, limit, offset, order}
 * 
 * @example
 * const query = buildSequelizeQuery(
 *   { puerto_id: 1, nombre: "Muelle A", limit: 50 },
 *   Puerto
 * );
 */
function buildSequelizeQuery(queryParams, modelo) {
    const where = {};
    const allowed = getAllowedFields(modelo);

    // Valores por defecto para paginación
    let limit = 100;
    let offset = 0;

    // Procesar limit (máximo 1000)
    if (queryParams.limit) {
        const l = parseInt(queryParams.limit);
        if (!Number.isNaN(l)) limit = Math.min(l, 1000);
    }

    // Procesar offset (solo enteros >= 0)
    if (queryParams.offset) {
        const o = parseInt(queryParams.offset);
        if (!Number.isNaN(o) && o >= 0) offset = o;
    }

    // Procesar order (formato: campo:direccion)
    let order = [];
    if (queryParams.order) {
        const [campo, direccion] = queryParams.order.split(":");

        // Validar que el campo exista en el modelo
        if (allowed.includes(campo)) {
            order.push([campo, direccion?.toUpperCase() === "DESC" ? "DESC" : "ASC"]);
        }
    }

    // Procesar filtros de rango (campo_min, campo_max)
    for (const key in queryParams) {
        if (!key.endsWith("_min") && !key.endsWith("_max")) continue;

        const baseField = key.replace(/_(min|max)$/, "");

        // Validar que el campo existe en el modelo
        if (!allowed.includes(baseField)) continue;

        const min = queryParams[`${baseField}_min`];
        const max = queryParams[`${baseField}_max`];

        if (min !== undefined && max !== undefined) {
            // Rango entre dos valores
            where[baseField] = {
                [Op.between]: [parseValue(min), parseValue(max)]
            };
        } else if (min !== undefined) {
            // Mayor o igual que
            where[baseField] = {
                [Op.gte]: parseValue(min)
            };
        } else if (max !== undefined) {
            // Menor o igual que
            where[baseField] = {
                [Op.lte]: parseValue(max)
            };
        }
    }

    // Procesar filtros regulares (campos permitidos solamente)
    for (const key in queryParams) {
        // Ignorar parámetros especiales y de rango
        if (["limit", "offset", "order"].includes(key)) continue;
        if (key.endsWith('_min') || key.endsWith('_max')) continue;

        // Convertir valor y añadir a where si el campo es permitido
        if (allowed.includes(key)) {
            where[key] = parseValue(queryParams[key]);
        }
    }

    return { where, limit, offset, order };
}

module.exports = { parseValue, getAllowedFields, buildSequelizeQuery };