// services/puertoService.js
// Servicio para interactuar con el modelo Sequelize `puerto`
const ApiError = require("../utils/ApiError");
// Recuperar el modelo puerto
const { puerto } = require("../models");
const { buildSequelizeQuery } = require("../utils/queryUtils.js");
const idValidator = require("../validators/idValidator.js");
const puertoQueryValidator = require("../validators/puertoQueryValidator.js");
const { puertoSchemaFull, puertoSchemaPartial } = require("../validators/puertoBodyValidator.js");

class PuertoService {

    async getPuertos(queryParams) {
        // Devuelve todos los Puertos que coincidan con el filtro.
        try {
            // Validación de entrada del dominio
            const { error, value } = puertoQueryValidator.validate(queryParams, {
                abortEarly: false,
                stripUnknown: true
            });
            if (error) {
                throw new ApiError("Invalid puerto query", 400);
            }

            const queryOptions = buildSequelizeQuery(value, puerto);
            const result = await puerto.findAndCountAll(queryOptions);
            return result;
        } catch (err) {
            if (err.status) throw err;

            if (err.code && err.sqlMessage) {
                throw new ApiError('Database error while getting muelles', 500);
            }

            throw new ApiError('Unexpected error while getting muelles', 500);
        }
    }

    async getPuertoById(id_puerto) {
        // Devuelve un Puerto por su id
        try {
            const id = Number(id_puerto);
            idValidator(id);

            const result = await puerto.findByPk(id);
            if (!result) throw new ApiError('Puerto not found', 404);
            return result;
        } catch (err) {
            if (err.status) throw err;

            if (err.code && err.sqlMessage) {
                throw new ApiError('Database error while getting puerto', 500);
            }

            throw new ApiError('Unexpected error while getting puerto', 500);
        }
    }

    async createPuerto(data) {
        //Crea un Puerto
        try {
            // Validación de entrada del dominio
            const { error, value } = puertoSchemaFull.validate(data, {
                abortEarly: false,
                stripUnknown: true
            });
            if (error) {
                throw new ApiError("Invalid puerto data", 400);
            }

            const result = await puerto.create(value);
            return result;
        } catch (err) {
            if (err.status) throw err;

            if (err.code && err.sqlMessage) {
                throw new ApiError('Database error while creating puerto', 500);
            }

            throw new ApiError('Unexpected error while creating puerto', 500);
        }
    }

    async updatePuerto(id_puerto, data, isPartial = false) {
        // Actualiza un puerto
        try {
            const id = Number(id_puerto);
            idValidator(id);

            // Validación de entrada del dominio
            const schema = isPartial ? puertoSchemaPartial : puertoSchemaFull;
            const { error, value } = schema.validate(data, {
                abortEarly: false,
                stripUnknown: true
            });
            if (error) {
                throw new ApiError("Invalid puerto data", 400);
            }

            const [numFilas] = await puerto.update(value, { where: { id_puerto: id } });
            if (numFilas === 0) throw new ApiError('Puerto not found or without changes', 404);
            return numFilas; // 0 = no actualizado, 1 = actualizado
        } catch (err) {
            if (err.status) throw err;

            if (err.code && err.sqlMessage) {
                throw new ApiError('Database error while updating puerto', 500);
            }

            throw new ApiError('Unexpected error while updating puerto', 500);
        }
    }

    async deletePuerto(id_puerto) {
        //Borrar un Puerto
        try {
            const id = Number(id_puerto);
            idValidator(id);
            const numFilas = await puerto.destroy({ where: { id_puerto: id } });
            if (numFilas === 0) throw new ApiError('Puerto not found', 404);
            return numFilas;
        } catch (err) {
            if (err.status) throw err;

            if (err.code && err.sqlMessage) {
                throw new ApiError('Database error while deleting puerto', 500);
            }

            throw new ApiError('Unexpected error while deleting puerto', 500);
        }
    }
}

module.exports = new PuertoService();