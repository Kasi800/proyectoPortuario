const Joi = require("joi");

/**
 * Construye y devuelve un validador Joi dinámico para los filtros
 * basados en los atributos (`rawAttributes`) de un modelo Sequelize.
 *
 * Uso: validar query params recibidos para búsquedas/filtrado antes
 * de pasarlos al servicio.
 *
 * Nota: el validador no permite claves desconocidas (`unknown(false)`).
 * 
 * @param {Object} model - Modelo Sequelize (se usa `model.rawAttributes`)
 * @returns {Joi.Schema} Esquema Joi para validar filtros
 */
function filterValidator(model) {
    // Campos permitidos a partir de la definición del modelo
    const allowed = Object.keys(model.rawAttributes);

    // Forma del esquema Joi que iremos construyendo dinámicamente
    const schemaShape = {};

    // Mapear tipos Sequelize a validadores Joi apropiados
    for (const field of allowed) {
        const attr = model.rawAttributes[field];

        // `attr.type.constructor.key` contiene la clave del tipo (ej. INTEGER, STRING)
        if (attr.type.constructor.key === "INTEGER") {
            // Enteros
            schemaShape[field] = Joi.number().integer();
        } else if (attr.type.constructor.key === "FLOAT" || attr.type.constructor.key === "DOUBLE") {
            // Números de punto flotante
            schemaShape[field] = Joi.number();
        } else if (attr.type.constructor.key === "BOOLEAN") {
            // Booleanos
            schemaShape[field] = Joi.boolean();
        } else if (attr.type.constructor.key === "DATE") {
            // Fechas
            schemaShape[field] = Joi.date();
        } else {
            // Por defecto tratar como string (STRING, TEXT, etc.)
            schemaShape[field] = Joi.string();
        }
    }

    // Devolver un objeto Joi que valide exclusivamente las claves definidas
    return Joi.object(schemaShape).unknown(false);
}

module.exports = filterValidator;