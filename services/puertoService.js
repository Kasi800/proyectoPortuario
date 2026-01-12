// services/puertoService.js
// Servicio para interactuar con el modelo Sequelize `puerto`

// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js").initModels;
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");
const { logMensaje } = require("../utils/logger.js");
const ApiError = require("../utils/ApiError");
// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);
// Recuperar el modelo puerto
const Puerto = models.puerto;

const { parseValue, getAllowedFields } = require("../utils/queryUtils.js");

class PuertoService {

    async getPuertos(queryParams) {
        // Devuelve todos los Puertos que coincidan con el filtro.
        try {
            const where = {};
            const allowed = getAllowedFields();

            // Soportar paginación básica
            let limit = 100;
            let offset = 0;
            if (queryParams.limit) {
                const l = parseInt(queryParams.limit, 10);
                if (!Number.isNaN(l)) limit = Math.min(l, 1000);
            }
            if (queryParams.offset) {
                const o = parseInt(queryParams.offset, 10);
                if (!Number.isNaN(o) && o >= 0) offset = o;
            }

            for (const key in queryParams) {
                if (key === 'limit' || key === 'offset') continue;
                if (allowed.length && allowed.indexOf(key) === -1) continue;
                where[key] = parseValue(queryParams[key]);
            }

            const result = await Puerto.findAll({ where, limit, offset });
            return result;
        } catch (err) {
            logMensaje('Error getPuertos:', err && err.message ? err.message : err);
            throw new ApiError('Error al obtener puertos', 500);
        }
    }

    async getPuertoById(id_puerto) {
        // Devuelve un Puerto por su id
        try {
            const id = Number(id_puerto);
            if (!Number.isFinite(id)) throw new ApiError('Identificador inválido', 400);
            const result = await Puerto.findByPk(id);
            if (!result) throw new ApiError('Puerto no encontrado', 404);
            return result;
        } catch (err) {
            if (err.status) throw err;
            logMensaje('Error getPuertoById:', err && err.message ? err.message : err);
            throw new ApiError('Error al obtener puerto', 500);
        }
    }

    async createPuerto(puerto) {
        //Crea un Puerto
        try {
            const result = await Puerto.create(puerto);
            return result;
        } catch (err) {
            logMensaje('Error createPuerto:', err && err.message ? err.message : err);
            throw new ApiError('Error al crear puerto', 500);
        }
    }

    async updatePuerto(id_puerto, data) {
        // Actualiza un puerto
        try {
            const id = Number(id_puerto);
            if (!Number.isFinite(id)) throw new ApiError('Identificador inválido', 400);
            const [numFilas] = await Puerto.update(data, { where: { id_puerto: id } });
            if (numFilas === 0) throw new ApiError('Puerto no encontrado o sin cambios', 404);
            return numFilas; // 0 = no actualizado, 1 = actualizado
        } catch (err) {
            if (err.status) throw err;
            logMensaje('Error updatePuerto:', err && err.message ? err.message : err);
            throw new ApiError('Error al actualizar puerto', 500);
        }
    }

    async deletePuerto(id_puerto) {
        //Borrar un Puerto
        try {
            const id = Number(id_puerto);
            if (!Number.isFinite(id)) throw new ApiError('Identificador inválido', 400);
            const numFilas = await Puerto.destroy({ where: { id_puerto: id } });
            if (numFilas === 0) throw new ApiError('Puerto no encontrado', 404);
            return numFilas;
        } catch (err) {
            if (err.status) throw err;
            logMensaje('Error deletePuerto:', err && err.message ? err.message : err);
            throw new ApiError('Error al borrar puerto', 500);
        }
    }
}

module.exports = new PuertoService();