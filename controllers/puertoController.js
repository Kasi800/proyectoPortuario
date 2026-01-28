/*
 * puertoController.js - Controlador para gestión de puertos
 * Maneja las solicitudes HTTP y delega lógica al servicio
 */

const puertoService = require("../services/puertoService");

// ============================================================
// CLASE CONTROLADORA
// ============================================================

/**
 * Controlador para rutas de puertos
 * Recibe solicitudes HTTP y coordina con el servicio
 */
class PuertoController {

    /**
     * Obtiene todos los puertos con filtros opcionales
     * 
     * @param {Object} req - Objeto de solicitud (query params)
     * @param {Object} res - Objeto de respuesta
     * @returns {Promise<void>} JSON con lista de puertos
     */
    async getPuertos(req, res) {
        const puertos = await puertoService.getPuertos(req.query);
        return res.status(200).json({ 
            ok: true, 
            data: puertos, 
            message: "Ports successfully recovered" 
        });
    }

    /**
     * Obtiene un puerto por ID
     * 
     * @param {Object} req - Objeto de solicitud (parámetro id)
     * @param {Object} res - Objeto de respuesta
     * @returns {Promise<void>} JSON con datos del puerto
     */
    async getPuertoById(req, res) {
        const id_puerto = req.params.id;
        const puerto = await puertoService.getPuertoById(id_puerto);
        return res.status(200).json({ 
            ok: true, 
            data: puerto, 
            message: "Port recovered correctly" 
        });
    }

    /**
     * Crea un nuevo puerto
     * 
     * @param {Object} req - Objeto de solicitud (body con datos)
     * @param {Object} res - Objeto de respuesta
     * @returns {Promise<void>} JSON con puerto creado (status 201)
     */
    async createPuerto(req, res) {
        const puerto = req.body;
        const puertoNew = await puertoService.createPuerto(puerto);
        return res.status(201).json({ 
            ok: true, 
            data: puertoNew, 
            message: "Port created correctly" 
        });
    }

    /**
     * Actualiza completamente un puerto (PUT)
     * 
     * @param {Object} req - Objeto de solicitud (params: id, body: datos)
     * @param {Object} res - Objeto de respuesta
     * @returns {Promise<void>} JSON con número de filas actualizadas
     */
    async updatePuerto(req, res) {
        const id = req.params.id;
        const data = req.body;
        const filas = await puertoService.updatePuerto(id, data);
        return res.json({ 
            ok: true, 
            data: filas, 
            message: "Port updated correctly" 
        });
    }

    /**
     * Actualiza parcialmente un puerto (PATCH)
     * Permite actualización de solo algunos campos
     * 
     * @param {Object} req - Objeto de solicitud (params: id, body: datos parciales)
     * @param {Object} res - Objeto de respuesta
     * @returns {Promise<void>} JSON con número de filas actualizadas
     */
    async patchPuerto(req, res) {
        const id = req.params.id;
        const data = req.body;
        // Pasar true como tercer parámetro para indicar actualización parcial
        const filas = await puertoService.updatePuerto(id, data, true);
        return res.json({ 
            ok: true, 
            data: filas, 
            message: "Port updated correctly" 
        });
    }

    /**
     * Elimina un puerto
     * 
     * @param {Object} req - Objeto de solicitud (parámetro id)
     * @param {Object} res - Objeto de respuesta
     * @returns {Promise<void>} Respuesta vacía (status 204)
     */
    async deletePuerto(req, res) {
        const id_puerto = req.params.id;
        const numFilas = await puertoService.deletePuerto(id_puerto);
        return res.status(204).send();
    }
}

module.exports = new PuertoController();
