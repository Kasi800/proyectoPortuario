// controllers/puertoController.js
const { logMensaje } = require("../utils/logger.js");
const puertoService = require("../services/puertoService");

class PuertoController {

    async getPuertos(req, res) {
        const puertos = await puertoService.getPuertos(req.query);
        return res.status(200).json({ ok: true, data: puertos, message: "Ports successfully recovered" });
    }

    async createPuerto(req, res) {
        const puerto = req.body;
        const puertoNew = await puertoService.createPuerto(puerto);
        return res.status(201).json({ ok: true, data: puertoNew, message: "Port created correctly" });
    }

    async deletePuerto(req, res) {
        const id_puerto = req.params.id;
        const numFilas = await puertoService.deletePuerto(id_puerto);
        return res.status(204).json({ ok: true, data: numFilas, message: "Port deleted correctly" });
    }

    async getPuertoById(req, res) {
        const id_puerto = req.params.id;
        const puerto = await puertoService.getPuertoById(id_puerto);
        return res.status(200).json({ ok: true, data: puerto, message: "Port recovered correctly" });
    }

    async updatePuerto(req, res) {
        const id = req.params.id;
        const data = req.body;
        const filas = await puertoService.updatePuerto(id, data);
        return res.json({ ok: true, data: filas, message: "Port updated correctly" });
    }
}

module.exports = new PuertoController();
