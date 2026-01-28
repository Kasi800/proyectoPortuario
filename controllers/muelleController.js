/*
 * muelleController.js - Controlador para gestión de muelles
 * Maneja las solicitudes HTTP y delega lógica al servicio
 */

const muelleService = require("../services/muelleService");

// ============================================================
// CLASE CONTROLADORA
// ============================================================

/**
 * Controlador para rutas de muelles
 * Recibe solicitudes HTTP y coordina con el servicio
 */
class MuelleController {

    /**
     * Obtiene todos los muelles con filtros opcionales
     * 
     * @param {Object} req - Objeto de solicitud (query params)
     * @param {Object} res - Objeto de respuesta
     * @returns {Promise<void>} JSON con lista de muelles
     */
    async getMuelle(req, res) {
        const muelles = await muelleService.getMuelles(req.query);
        return res.status(200).json({ 
            ok: true, 
            data: muelles, 
            message: "Docks successfully recovered" 
        });
    }

    /**
     * Obtiene un muelle por ID
     * 
     * @param {Object} req - Objeto de solicitud (parámetro id)
     * @param {Object} res - Objeto de respuesta
     * @returns {Promise<void>} JSON con datos del muelle
     */
    async getMuelleById(req, res) {
        const id_muelle = req.params.id;
        const muelle = await muelleService.getMuelleById(id_muelle);
        return res.status(200).json({ 
            ok: true, 
            data: muelle, 
            message: "Dock recovered correctly" 
        });
    }

    /**
     * Crea un nuevo muelle
     * 
     * @param {Object} req - Objeto de solicitud (body con datos)
     * @param {Object} res - Objeto de respuesta
     * @returns {Promise<void>} JSON con muelle creado (status 201)
     */
    async createMuelle(req, res) {
        const muelle = req.body;
        const muelleNew = await muelleService.createMuelle(muelle);
        return res.status(201).json({ 
            ok: true, 
            data: muelleNew, 
            message: "Dock created correctly" 
        });
    }

    /**
     * Actualiza completamente un muelle (PUT)
     * 
     * @param {Object} req - Objeto de solicitud (params: id, body: datos)
     * @param {Object} res - Objeto de respuesta
     * @returns {Promise<void>} JSON con número de filas actualizadas
     */
    async updateMuelle(req, res) {
        const id = req.params.id;
        const data = req.body;
        const filas = await muelleService.updateMuelle(id, data);
        return res.json({ 
            ok: true, 
            data: filas, 
            message: "Dock updated correctly" 
        });
    }

    /**
     * Actualiza parcialmente un muelle (PATCH)
     * Permite actualización de solo algunos campos
     * 
     * @param {Object} req - Objeto de solicitud (params: id, body: datos parciales)
     * @param {Object} res - Objeto de respuesta
     * @returns {Promise<void>} JSON con número de filas actualizadas
     */
    async patchMuelle(req, res) {
        const id = req.params.id;
        const data = req.body;
        // Pasar true como tercer parámetro para indicar actualización parcial
        const filas = await muelleService.updateMuelle(id, data, true);
        return res.json({ 
            ok: true, 
            data: filas, 
            message: "Dock updated correctly" 
        });
    }

    /**
     * Elimina un muelle
     * 
     * @param {Object} req - Objeto de solicitud (parámetro id)
     * @param {Object} res - Objeto de respuesta
     * @returns {Promise<void>} Respuesta vacía (status 204)
     */
    async deleteMuelle(req, res) {
        const id_muelle = req.params.id;
        const numFilas = await muelleService.deleteMuelle(id_muelle);
        return res.status(204).send();
    }
}

module.exports = new MuelleController();