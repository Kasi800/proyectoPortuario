/*
 * orderValidator.js - Validador de criterios de ordenación
 * Valida parámetros de ordenamiento con formato 'campo:dirección'
 */

const Joi = require("joi");

// ============================================================
// VALIDADOR DE ORDEN (SORTING)
// ============================================================

/**
 * Construye una regla de validación para el parámetro de ordenación
 * 
 * Funcionalidades:
 * - Formato: Exige el patrón 'nombre_columna:asc' o 'nombre_columna:desc'
 * - Restricción: Verifica que la columna exista en la lista de campos permitidos
 * - Flexibilidad: Permite el uso de mayúsculas/minúsculas en la dirección (i)
 * 
 * @param {string[]} allowedFields - Array con los nombres de columnas permitidas
 * @returns {Joi.StringSchema} Esquema Joi para validar el string de orden
 * 
 * @example
 * const schema = orderValidator(['nombre']);
 * // Válido: "nombre:asc", "nombre:DESC" | Inválido: "precio:asc"
 */
function orderValidator(allowedFields) {
    return Joi.string()
        // Validar estructura básica mediante expresión regular
        .pattern(/^[a-zA-Z_]+:(asc|desc)$/i)
        // Validar que el campo específico sea una columna real del modelo
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