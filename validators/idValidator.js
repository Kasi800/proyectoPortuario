/*
 * idValidator.js - Validador de identificadores numéricos
 * Verifica que los IDs sean números enteros positivos y válidos
 */

const ApiError = require("../utils/ApiError");

// ============================================================
// VALIDADOR DE IDENTIFICADOR
// ============================================================

/**
 * Valida que un valor sea un ID numérico entero y positivo
 * 
 * Criterios de validación:
 * - Debe ser un número mayor a cero
 * - Debe ser un valor finito
 * - Debe coincidir exactamente con su representación en string (evita floats)
 * 
 * @param {string|number} id - El identificador a validar
 * @throws {ApiError} 400 - Si el identificador no es un entero válido
 * @returns {void}
 */
function idValidator(id) {
    const num = parseInt(id);

    // Comprobar si es positivo, finito y si el casteo es exacto
    if (num <= 0 || !Number.isFinite(num) || String(num) !== String(id)) {
        throw new ApiError('Invalid identifier', 400);
    }
}

module.exports = idValidator;