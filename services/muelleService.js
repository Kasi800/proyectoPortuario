/*
 * muelleService.js - Servicio para gestión de muelles
 * Capa de negocio entre controladores y modelos de BD
 */

const ApiError = require("../utils/ApiError");
const { muelle, puerto } = require("../models");
const { buildSequelizeQuery } = require("../utils/queryUtils.js");
const idValidator = require("../validators/idValidator.js");
const { muelleSchemaFull, muelleSchemaPartial } = require("../validators/muelleBodyValidator.js");
const muelleQueryValidator = require("../validators/muelleQueryValidator.js");

// ============================================================
// CLASE DE SERVICIO
// ============================================================

/**
 * Servicio para operaciones CRUD sobre muelles
 * Maneja validaciones, consultas a BD y manejo de errores
 */
class MuelleService {

    /**
     * Obtiene todos los muelles con filtros opcionales
     * 
     * @param {Object} queryParams - Parámetros de query (filtros, paginación, orden)
     * @returns {Promise<Object>} {rows: [], count: number}
     * @throws {ApiError}
     */
    async getMuelles(queryParams) {
        try {
            // Validar parámetros de consulta
            const { error, value } = muelleQueryValidator.validate(queryParams, {
                abortEarly: false,
                stripUnknown: true
            });
            if (error) {
                throw new ApiError("Invalid muelle query", 400);
            }

            // Construir consulta Sequelize
            const queryOptions = buildSequelizeQuery(value, muelle);

            // Incluir datos del puerto asociado
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

    /**
     * Obtiene un muelle por su ID
     * 
     * @param {number} id_muelle - ID del muelle
     * @returns {Promise<Object>} Datos del muelle
     * @throws {ApiError} Si no existe o hay error en BD
     */
    async getMuelleById(id_muelle) {
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

    /**
     * Crea un nuevo muelle
     * 
     * @param {Object} data - Datos del muelle (validados con schema completo)
     * @returns {Promise<Object>} Muelle creado
     * @throws {ApiError}
     */
    async createMuelle(data) {
        try {
            // Validar datos del muelle
            const { error, value } = muelleSchemaFull.validate(data, {
                abortEarly: false,
                stripUnknown: true
            });
            if (error) {
                throw new ApiError("Invalid muelle data", 400);
            }

            // Validar que el puerto existe
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

    /**
     * Actualiza un muelle existente
     * 
     * @param {number} id_muelle - ID del muelle a actualizar
     * @param {Object} data - Nuevos datos del muelle
     * @param {boolean} isPartial - Si true, permite actualización parcial (PATCH)
     * @returns {Promise<number>} Cantidad de filas actualizadas
     * @throws {ApiError}
     */
    async updateMuelle(id_muelle, data, isPartial = false) {
        try {
            const id = Number(id_muelle);
            idValidator(id);

            // Usar schema parcial (PATCH) o completo (PUT)
            const schema = isPartial ? muelleSchemaPartial : muelleSchemaFull;
            const { error, value } = schema.validate(data, {
                abortEarly: false,
                stripUnknown: true
            });
            if (error) {
                throw new ApiError("Invalid muelle data", 400);
            }

            // Actualizar en BD
            const [numFilas] = await muelle.update(value, { where: { id_muelle: id } });
            if (numFilas === 0) throw new ApiError('Muelle not found or without changes', 404);
            
            return numFilas;
        } catch (err) {
            if (err.status) throw err;
            if (err.code && err.sqlMessage) {
                throw new ApiError('Database error while updating muelle', 500);
            }
            throw new ApiError('Unexpected error while updating muelle', 500);
        }
    }

    /**
     * Elimina un muelle
     * 
     * @param {number} id_muelle - ID del muelle a eliminar
     * @returns {Promise<number>} Cantidad de filas eliminadas
     * @throws {ApiError}
     */
    async deleteMuelle(id_muelle) {
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