const { Op } = require("sequelize");

/**
 * Convierte una cadena de query a su tipo primitivo más apropiado.
 * - "true"  -> true
 * - "false" -> false
 * - números  -> Number
 * - cualquier otra cadena -> se devuelve tal cual
 *
 * Esto es útil para transformar parámetros de consulta (query string)
 * previos a construir filtros para la capa de datos.
 *
 * @param {string} value
 * @returns {string|number|boolean}
 */
function parseValue(value) {
    if (value === "true") return true;
    if (value === "false") return false;
    // Detectar números enteros y flotantes (positivos y negativos)
    if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number(value);
    return value;
}

/**
 * Devuelve la lista de campos permitidos a partir de un modelo Sequelize.
 * Si el `modelo` es inválido o no tiene `rawAttributes`, devuelve un
 * array vacío en lugar de lanzar una excepción.
 *
 * @param {Object} modelo - instancia de modelo Sequelize o undefined
 * @returns {string[]} Array de nombres de atributos del modelo
 */
function getAllowedFields(modelo) {
    try {
        return Object.keys(modelo?.rawAttributes ? modelo.rawAttributes : {});
    } catch (e) {
        return [];
    }
}

/**
 * Construye un objeto de consulta compatible con Sequelize a partir
 * de los parámetros de query HTTP y un modelo Sequelize.
 *
 * Comportamiento principal:
 * - `limit`: por defecto 100; si se proporciona, se parsea y se limita a 1000 como máximo.
 * - `offset`: por defecto 0; si se proporciona, debe ser un entero >= 0.
 * - `order`: debe tener formato "campo:direccion" (ej. "nombre:desc");
 *   solo se aplica si `campo` está en la lista de campos permitidos del modelo.
 * - Para cada parámetro de query que coincida con un campo permitido se añade
 *   una entrada en `where` tras convertir el valor con `parseValue`.
 * - Se ignoran los parámetros especiales `limit`, `offset` y `order` al construir `where`.
 *
 * @param {Object} queryParams - objeto con parámetros de consulta (strings)
 * @param {Object} modelo - modelo Sequelize
 * @returns {{where: Object, limit: number, offset: number, order: Array}}
 *          objeto listo para pasar a métodos de consulta de Sequelize
 */
function buildSequelizeQuery(queryParams, modelo) {
    const where = {};
    const allowed = getAllowedFields(modelo);

    // Valores por defecto para paginación
    let limit = 100;
    let offset = 0;

    // Procesar `limit` si está presente (capar a 1000)
    if (queryParams.limit) {
        const l = parseInt(queryParams.limit);
        if (!Number.isNaN(l)) limit = Math.min(l, 1000);
    }

    // Procesar `offset` si está presente (solo enteros no negativos)
    if (queryParams.offset) {
        const o = parseInt(queryParams.offset);
        if (!Number.isNaN(o) && o >= 0) offset = o;
    }

    // Procesar `order` si está presente. Formato esperado: campo:direccion
    let order = [];
    if (queryParams.order) {
        const [campo, direccion] = queryParams.order.split(":");

        // Aplicar orden solo si el campo está permitido por el modelo
        if (allowed.includes(campo)) {
            order.push([campo, direccion?.toUpperCase() === "DESC" ? "DESC" : "ASC"]);
        }
    }

    // Procesar rangos (_min, _max)
    for (const key in queryParams) {
        if (!key.endsWith("_min") && !key.endsWith("_max")) continue;

        const baseField = key.replace(/_(min|max)$/, "");

        // Solo procesar si el campo base existe en el modelo
        if (!allowed.includes(baseField)) continue;

        const min = queryParams[`${baseField}_min`];
        const max = queryParams[`${baseField}_max`];

        if (min !== undefined && max !== undefined) {
            where[baseField] = {
                [Op.between]: [parseValue(min), parseValue(max)]
            };
        } else if (min !== undefined) {
            where[baseField] = {
                [Op.gte]: parseValue(min)
            };
        } else if (max !== undefined) {
            where[baseField] = {
                [Op.lte]: parseValue(max)
            };
        }
    }

    // Construir `where` usando solo campos permitidos y omitiendo parámetros especiales
    for (const key in queryParams) {
        if (["limit", "offset", "order"].includes(key)) continue;
        if (key.endsWith('_min') || key.endsWith('_max')) continue;

        // Convertir el valor de la query a su tipo primitivo más apropiado
        if (allowed.includes(key)) {
            where[key] = parseValue(queryParams[key]);
        }
    }

    return { where, limit, offset, order };
}

module.exports = { parseValue, getAllowedFields, buildSequelizeQuery };