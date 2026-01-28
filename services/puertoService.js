/*
 * puertoService.js - Servicio para gestión de puertos
 * Capa de negocio entre controladores y modelos de BD
 */

const ApiError = require("../utils/ApiError");
const { puerto } = require("../models");
const { buildSequelizeQuery } = require("../utils/queryUtils.js");
const idValidator = require("../validators/idValidator.js");
const puertoQueryValidator = require("../validators/puertoQueryValidator.js");
const { puertoSchemaFull, puertoSchemaPartial } = require("../validators/puertoBodyValidator.js");

// ============================================================
// CLASE DE SERVICIO
// ============================================================

/**
 * Servicio para operaciones CRUD sobre puertos
 * Maneja validaciones, consultas a BD y manejo de errores
 */
class PuertoService {

    /**
     * Obtiene todos los puertos con filtros opcionales
     * 
     * @param {Object} queryParams - Parámetros de query (filtros, paginación, orden)
     * @returns {Promise<Object>} {rows: [], count: number}
     * @throws {ApiError}
     */
    async getPuertos(queryParams) {
        try {
            // Validar parámetros de consulta
            const { error, value } = puertoQueryValidator.validate(queryParams, {
                abortEarly: false,
                stripUnknown: true
            });
            if (error) {
                throw new ApiError("Invalid puerto query", 400);
            }

            // Construir consulta Sequelize
            const queryOptions = buildSequelizeQuery(value, puerto);
            const result = await puerto.findAndCountAll(queryOptions);
            return result;
        } catch (err) {
            if (err.status) throw err;
            if (err.code && err.sqlMessage) {
                throw new ApiError('Database error while getting puertos', 500);
            }
            throw new ApiError('Unexpected error while getting puertos', 500);
        }
    }

    /**
     * Obtiene un puerto por su ID
     * 
     * @param {number} id_puerto - ID del puerto
     * @returns {Promise<Object>} Datos del puerto
     * @throws {ApiError} Si no existe o hay error en BD
     */
    async getPuertoById(id_puerto) {
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

    /**
     * Crea un nuevo puerto
     * 
     * @param {Object} data - Datos del puerto (validados con schema completo)
     * @returns {Promise<Object>} Puerto creado
     * @throws {ApiError}
     */
    async createPuerto(data) {
        try {
            // Validar datos del puerto
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

    /**
     * Actualiza un puerto existente
     * 
     * @param {number} id_puerto - ID del puerto a actualizar
     * @param {Object} data - Nuevos datos del puerto
     * @param {boolean} isPartial - Si true, permite actualización parcial (PATCH)
     * @returns {Promise<number>} Cantidad de filas actualizadas
     * @throws {ApiError}
     */
    async updatePuerto(id_puerto, data, isPartial = false) {
        try {
            const id = Number(id_puerto);
            idValidator(id);

            // Usar schema parcial (PATCH) o completo (PUT)
            const schema = isPartial ? puertoSchemaPartial : puertoSchemaFull;
            const { error, value } = schema.validate(data, {
                abortEarly: false,
                stripUnknown: true
            });
            if (error) {
                throw new ApiError("Invalid puerto data", 400);
            }

            // Actualizar en BD
            const [numFilas] = await puerto.update(value, { where: { id_puerto: id } });
            if (numFilas === 0) throw new ApiError('Puerto not found or without changes', 404);
            
            return numFilas;
        } catch (err) {
            if (err.status) throw err;
            if (err.code && err.sqlMessage) {
                throw new ApiError('Database error while updating puerto', 500);
            }
            throw new ApiError('Unexpected error while updating puerto', 500);
        }
    }

    /**
     * Elimina un puerto
     * 
     * @param {number} id_puerto - ID del puerto a eliminar
     * @returns {Promise<number>} Cantidad de filas eliminadas
     * @throws {ApiError}
     */
    async deletePuerto(id_puerto) {
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