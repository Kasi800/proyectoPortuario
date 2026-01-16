// services/puertoService.js
// Servicio para interactuar con el modelo Sequelize `puerto`
const { logMensaje } = require("../utils/logger.js");
const ApiError = require("../utils/ApiError");
// Recuperar el modelo puerto
const { puerto } = require("../models");
const { buildSequelizeQuery } = require("../utils/queryUtils.js");

class PuertoService {

    async getPuertos(queryParams) {
        // Devuelve todos los Puertos que coincidan con el filtro.
        try {
            const queryOptions = buildSequelizeQuery(queryParams, puerto);
            const result = await puerto.findAll(queryOptions);
            return result;
        } catch (err) {
            logMensaje('Error getPuertos:', err && err.message ? err.message : err);
            throw new ApiError('Error getPuertos', 500);
        }
    }

    async getPuertoById(id_puerto) {
        // Devuelve un Puerto por su id
        try {
            const id = Number(id_puerto);
            if (!Number.isFinite(id)) throw new ApiError('Invalid id', 400);
            const result = await puerto.findByPk(id);
            if (!result) throw new ApiError('Puerto not found', 404);
            return result;
        } catch (err) {
            if (err.status) throw err;
            logMensaje('Error getPuertoById:', err && err.message ? err.message : err);
            throw new ApiError('Error getPuertoById', 500);
        }
    }

    async createPuerto(data) {
        //Crea un Puerto
        try {
            const result = await puerto.create(data);
            return result;
        } catch (err) {
            logMensaje('Error createPuerto:', err && err.message ? err.message : err);
            throw new ApiError('Error createPuerto', 500);
        }
    }

    async updatePuerto(id_puerto, data) {
        // Actualiza un puerto
        try {
            const id = Number(id_puerto);
            if (!Number.isFinite(id)) throw new ApiError('Invalid id', 400);
            const [numFilas] = await puerto.update(data, { where: { id_puerto: id } });
            if (numFilas === 0) throw new ApiError('Puerto not found or without changes', 404);
            return numFilas; // 0 = no actualizado, 1 = actualizado
        } catch (err) {
            if (err.status) throw err;
            logMensaje('Error updatePuerto:', err && err.message ? err.message : err);
            throw new ApiError('Error updatePuerto', 500);
        }
    }

    async deletePuerto(id_puerto) {
        //Borrar un Puerto
        try {
            const id = Number(id_puerto);
            if (!Number.isFinite(id)) throw new ApiError('Invalid id', 400);
            const numFilas = await puerto.destroy({ where: { id_puerto: id } });
            if (numFilas === 0) throw new ApiError('Puerto not found', 404);
            return numFilas;
        } catch (err) {
            if (err.status) throw err;
            logMensaje('Error deletePuerto:', err && err.message ? err.message : err);
            throw new ApiError('Error deletePuerto', 500);
        }
    }
}

module.exports = new PuertoService();