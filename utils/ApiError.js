/*
 * ApiError.js - Clase personalizada para errores de API
 * Extiende Error para manejar respuestas HTTP controladas
 */

// ============================================================
// CLASE DE ERROR PERSONALIZADO
// ============================================================

/**
 * Clase para errores controlados en la API
 * Incluye mensaje, código HTTP y detalles adicionales
 * 
 * @class ApiError
 * @extends Error
 * @param {string} message - Mensaje de error legible
 * @param {number} status - Código HTTP (por defecto 500)
 * @param {any} details - Información adicional (ej: errores de validación)
 */
class ApiError extends Error {
    constructor(message, status = 500, details = null) {
        super(message);
        this.status = status;      // Código HTTP de la respuesta
        this.details = details;    // Datos adicionales del error
    }
}

module.exports = ApiError;
