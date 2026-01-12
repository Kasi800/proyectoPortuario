const Joi = require("joi");

/**
 * Validador de ordenación para query params `order` del tipo `campo:asc|desc`.
 *
 * - Acepta una cadena que cumpla el patrón `nombre_campo:asc` o `nombre_campo:desc`.
 * - Comprueba que `nombre_campo` esté dentro de `allowedFields`.
 *
 * Ejemplo válido: `nombre:asc` o `capacidad_teu:desc`
 * 
 * @param {string[]} allowedFields - Lista de campos permitidos para ordenar
 * @returns {Joi.Schema} Esquema Joi para validar el parámetro de orden
 */
function orderValidator(allowedFields) {
    return Joi.string()
        // Patrón básico: letras/guiones bajos + ':' + 'asc'|'desc' (insensible a mayúsculas)
        .pattern(/^[a-zA-Z_]+:(asc|desc)$/i)
        // Validación personalizada para asegurar que el campo exista en la lista permitida
        .custom((value, helpers) => {
            // Separar 'campo' y 'dirección' y comprobar sólo el campo
            const [campo] = value.split(":");
            if (!allowedFields.includes(campo)) {
                // Devolver error Joi estándar para prevenir información extra
                return helpers.error("any.invalid");
            }
            // Si todo está bien, devolver el valor original
            return value;
        }, "Order field validation");
}

module.exports = orderValidator;