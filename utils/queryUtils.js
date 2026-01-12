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

module.exports = { parseValue, getAllowedFields };