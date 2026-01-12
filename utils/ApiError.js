/**
 * Error personalizado para respuestas HTTP controladas.
 * - `message`: mensaje legible para el consumidor.
 * - `status`: código HTTP (por defecto 500).
 * - `details`: información adicional opcional (p. ej. errores de validación).
 */
class ApiError extends Error {
    constructor(message, status = 500, details = null) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

module.exports = ApiError;
