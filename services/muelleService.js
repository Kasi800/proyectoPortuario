// services/muelleService.js
// Servicio para interactuar con el modelo Sequelize `muelle`
const ApiError = require("../utils/ApiError");
// Recuperar el modelo muelle
const { muelle, puerto } = require("../models");
const { buildSequelizeQuery } = require("../utils/queryUtils.js");
const idValidator = require("../validators/idValidator.js");
const { muelleSchemaFull, muelleSchemaPartial } = require("../validators/muelleBodyValidator.js");
const muelleQueryValidator = require("../validators/muelleQueryValidator.js");

class MuelleService {

    async getMuelles(queryParams) {
        // Devuelve todos los Muelles que coincidan con el filtro.
        try {
            // Validación de entrada del dominio
            const { error, value } = muelleQueryValidator.validate(queryParams, {
                abortEarly: false,
                stripUnknown: true
            });
            if (error) {
                throw new ApiError("Invalid muelle query", 400);
            }

            const queryOptions = buildSequelizeQuery(value, muelle);

            // Incluir el modelo puerto para obtener el nombre del puerto asociado
            queryOptions.include = [{
                model: puerto,
                as: 'id_puerto_puerto',
                attributes: ['nombre']
            }];

            const result = await muelle.findAndCountAll(queryOptions);
            return result;
        } catch (err) {
            if (err.status) throw err;

            if (err.code && err.sqlMessage) {
                throw new ApiError('Database error while getting muelles', 500);
            }

            throw new ApiError('Unexpected error while getting muelles', 500);
        }
    }

    async getMuelleById(id_muelle) {
        // Devuelve un Muelle por su id
        try {
            const id = Number(id_muelle);
            idValidator(id);
            const result = await muelle.findByPk(id);
            if (!result) throw new ApiError('Muelle not found', 404);
            return result;
        } catch (err) {
            if (err.status) throw err;

            if (err.code && err.sqlMessage) {
                throw new ApiError('Database error while getting muelle', 500);
            }

            throw new ApiError('Unexpected error while getting muelle', 500);
        }
    }

    async createMuelle(data) {
        //Crea un Muelle
        try {
            // Validación de entrada del dominio
            const { error, value } = muelleSchemaFull.validate(data, {
                abortEarly: false,
                stripUnknown: true
            });
            if (error) {
                throw new ApiError("Invalid muelle data", 400);
            }

            // Validación de negocio 
            const puertoExiste = await puerto.findByPk(value.id_puerto);
            if (!puertoExiste) throw new ApiError("Puerto not found", 404);

            const result = await muelle.create(value);
            return result;
        } catch (err) {
            if (err.status) throw err;

            if (err.code && err.sqlMessage) {
                throw new ApiError('Database error while creating muelle', 500);
            }

            throw new ApiError('Unexpected error while creating muelle', 500);
        }
    }

    async updateMuelle(id_muelle, data, isPartial = false) {
        // Actualiza un Muelle
        try {
            const id = Number(id_muelle);
            idValidator(id);

            // Validación de entrada del dominio
            const schema = isPartial ? muelleSchemaPartial : muelleSchemaFull;
            const { error, value } = schema.validate(data, {
                abortEarly: false,
                stripUnknown: true
            });
            if (error) {
                throw new ApiError("Invalid muelle data", 400);
            }

            const [numFilas] = await muelle.update(value, { where: { id_muelle: id } });
            if (numFilas === 0) throw new ApiError('Muelle not found or without changes', 404);
            return numFilas; // 0 = no actualizado, 1 = actualizado
        } catch (err) {
            if (err.status) throw err;

            if (err.code && err.sqlMessage) {
                throw new ApiError('Database error while updating muelle', 500);
            }

            throw new ApiError('Unexpected error while updating muelle', 500);
        }
    }

    async deleteMuelle(id_muelle) {
        //Borrar un Muelle
        try {
            const id = Number(id_muelle);
            idValidator(id);
            const numFilas = await muelle.destroy({ where: { id_muelle: id } });
            if (numFilas === 0) throw new ApiError('Muelle not found', 404);
            return numFilas;
        } catch (err) {
            if (err.status) throw err;

            if (err.code && err.sqlMessage) {
                throw new ApiError('Database error while deleting muelle', 500);
            }

            throw new ApiError('Unexpected error while deleting muelle', 500);
        }
    }
}

module.exports = new MuelleService();