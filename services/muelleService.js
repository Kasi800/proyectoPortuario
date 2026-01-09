// services/muelleService.js
// Servicio para interactuar con el modelo Sequelize `muelle`

// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js").initModels;
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");
const { logMensaje } = require("../utils/logger.js");
const ApiError = require("../utils/ApiError");
// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);
// Recuperar el modelo muelle
const Muelle = models.muelle;

function parseValue(value) {
    if (value === "true") return true;
    if (value === "false") return false;
    if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number(value);
    return value;
}

function getAllowedFields() {
    try {
        return Object.keys(Muelle && Muelle.rawAttributes ? Muelle.rawAttributes : {});
    } catch (e) {
        return [];
    }
}

class MuelleService {

    async getMuelles(queryParams) {
        // Devuelve todos los Muelles que coincidan con el filtro.
        try {
            const where = {};
            const allowed = getAllowedFields();

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

            const result = await Muelle.findAll({ where, limit, offset });
            return result;
        } catch (err) {
            logMensaje('Error getMuelles:', err && err.message ? err.message : err);
            throw new ApiError('Error al obtener muelles', 500);
        }
    }

    async getMuelleById(id_muelle) {
        // Devuelve un Muelle por su id
        try {
            const id = Number(id_muelle);
            if (!Number.isFinite(id)) throw new ApiError('Identificador inválido', 400);
            const result = await Muelle.findByPk(id);
            if (!result) throw new ApiError('Muelle no encontrado', 404);
            return result;
        } catch (err) {
            if (err.status) throw err;
            logMensaje('Error getMuelleById:', err && err.message ? err.message : err);
            throw new ApiError('Error al obtener muelle', 500);
        }
    }

    async createMuelle(muelle) {
        //Crea un Muelle
        try {
            const result = await Muelle.create(muelle);
            return result;
        } catch (err) {
            logMensaje('Error createMuelle:', err && err.message ? err.message : err);
            throw new ApiError('Error al crear muelle', 500);
        }
    }

    async updateMuelle(id_muelle, data) {
        // Actualiza un Muelle
        try {
            const id = Number(id_muelle);
            if (!Number.isFinite(id)) throw new ApiError('Identificador inválido', 400);
            const [numFilas] = await Muelle.update(data, { where: { id_muelle: id } });
            if (numFilas === 0) throw new ApiError('Muelle no encontrado o sin cambios', 404);
            return numFilas; // 0 = no actualizado, 1 = actualizado
        } catch (err) {
            if (err.status) throw err;
            logMensaje('Error updateMuelle:', err && err.message ? err.message : err);
            throw new ApiError('Error al actualizar muelle', 500);
        }
    }

    async deleteMuelle(id_muelle) {
        //Borrar un Muelle
        try {
            const id = Number(id_muelle);
            if (!Number.isFinite(id)) throw new ApiError('Identificador inválido', 400);
            const numFilas = await Muelle.destroy({ where: { id_muelle: id } });
            if (numFilas === 0) throw new ApiError('Muelle no encontrado', 404);
            return numFilas;
        } catch (err) {
            if (err.status) throw err;
            logMensaje('Error deleteMuelle:', err && err.message ? err.message : err);
            throw new ApiError('Error al borrar muelle', 500);
        }
    }
}

module.exports = new MuelleService();