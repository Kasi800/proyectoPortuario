const queryValidator = require("./queryValidator");
// Cargar modelos inicializados pasando la instancia de Sequelize
// `init-models` devuelve un objeto con todos los modelos
const models = require("../models/init-models")(require("../config/sequelize"));

/**
 * Validador específico para consultas sobre `puerto`.
 *
 * Construye y exporta el esquema Joi para validar query params (limit, offset,
 * order y filtros) basado en la definición del modelo `puerto`.
 */
const puertoQueryValidator = queryValidator(models.puerto);
module.exports = puertoQueryValidator;