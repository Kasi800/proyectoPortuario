// services/muelleService.js
// Servicio para interactuar con el modelo Sequelize `muelle`
const { logMensaje } = require("../utils/logger.js");
const ApiError = require("../utils/ApiError");
// Recuperar el modelo muelle
const { muelle, puerto } = require("../models");
const { buildSequelizeQuery } = require("../utils/queryUtils.js");

class MuelleService {

    async getMuelles(queryParams) {
        // Devuelve todos los Muelles que coincidan con el filtro.
        try {
            const queryOptions = buildSequelizeQuery(queryParams, muelle);

            // Incluir el modelo puerto para obtener el nombre del puerto asociado
            queryOptions.include = [{
                model: puerto,
                as: 'id_puerto_puerto',
                attributes: ['nombre']
            }];

            const result = await muelle.findAndCountAll(queryOptions);
            return result;
        } catch (err) {
            logMensaje('Error getMuelles:', err && err.message ? err.message : err);
            throw new ApiError('Error getMuelles', 500);
        }
    }

    async getMuelleById(id_muelle) {
        // Devuelve un Muelle por su id
        try {
            const id = parseInt(id_muelle);
            if (id <= 0 || !Number.isFinite(id) || String(id) !== String(id_muelle)) throw new ApiError('Invalid id', 400);
            const result = await muelle.findByPk(id);
            if (!result) throw new ApiError('Muelle not found', 404);
            return result;
        } catch (err) {
            if (err.status) throw err;
            logMensaje('Error getMuelleById:', err && err.message ? err.message : err);
            throw new ApiError('Error getMuelleById', 500);
        }
    }

    async createMuelle(data) {
        //Crea un Muelle
        try {
            const result = await muelle.create(data);
            return result;
        } catch (err) {
            logMensaje('Error createMuelle:', err && err.message ? err.message : err);
            throw new ApiError('Error createMuelle', 500);
        }
    }

    async updateMuelle(id_muelle, data) {
        // Actualiza un Muelle
        try {
            const id = parseInt(id_muelle);
            if (id <= 0 || !Number.isFinite(id) || String(id) !== String(id_muelle)) throw new ApiError('Invalid identifier', 400);
            const [numFilas] = await muelle.update(data, { where: { id_muelle: id } });
            if (numFilas === 0) throw new ApiError('Muelle not found or without changes', 404);
            return numFilas; // 0 = no actualizado, 1 = actualizado
        } catch (err) {
            if (err.status) throw err;
            logMensaje('Error updateMuelle:', err && err.message ? err.message : err);
            throw new ApiError('Error updateMuelle', 500);
        }
    }

    async deleteMuelle(id_muelle) {
        //Borrar un Muelle
        try {
            const id = parseInt(id_muelle);
            if (id <= 0 || !Number.isFinite(id) || String(id) !== String(id_muelle)) throw new ApiError('Invalid identifier', 400);
            const numFilas = await muelle.destroy({ where: { id_muelle: id } });
            if (numFilas === 0) throw new ApiError('Muelle not found', 404);
            return numFilas;
        } catch (err) {
            if (err.status) throw err;
            logMensaje('Error deleteMuelle:', err && err.message ? err.message : err);
            throw new ApiError('Error deleteMuelle', 500);
        }
    }
}

module.exports = new MuelleService();