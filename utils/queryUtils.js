function parseValue(value) {
    if (value === "true") return true;
    if (value === "false") return false;
    if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number(value);
    return value;
}

function getAllowedFields(modelo) {
    try {
        return Object.keys(modelo?.rawAttributes ? modelo.rawAttributes : {});
    } catch (e) {
        return [];
    }
}

module.exports = { parseValue, getAllowedFields };