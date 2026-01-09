// controllers/puertoController.js
const { logMensaje } = require("../utils/logger.js");
const puertoService = require("../services/puertoService");

class PuertoController {

    async getPuertos(req, res) {
        const puertos = await puertoService.getPuertos(req.query);
        return res.status(200).json({ ok: true, datos: puertos, mensaje: "Puertos recuperados correctamente" });
    }

    async createPuerto(req, res) {
        const puerto = req.body;
        const puertoNew = await puertoService.createPuerto(puerto);
        return res.status(201).json({ ok: true, datos: puertoNew, mensaje: "Puerto creado correctamente" });
    }

    async deletePuerto(req, res) {
        const id_puerto = req.params.id;
        const numFilas = await puertoService.deletePuerto(id_puerto);
        if (numFilas == 0) return res.status(404).json({ ok: false, datos: null, mensaje: "Puerto no encontrado: " + id_puerto });
        return res.status(204).send();
    }

    async getPuertoById(req, res) {
        const id_puerto = req.params.id;
        const puerto = await puertoService.getPuertoById(id_puerto);
        return res.status(200).json({ ok: true, datos: puerto, mensaje: "Puerto recuperado correctamente" });
    }

    async updatePuerto(req, res) {
        const id = req.params.id;
        const data = req.body;
        const filas = await puertoService.updatePuerto(id, data);
        if (filas === 0) return res.status(404).json({ message: "Puerto no encontrado" });
        return res.json({ message: "Puerto actualizado correctamente" });
    }
}

module.exports = new PuertoController();
