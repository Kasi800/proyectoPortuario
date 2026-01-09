// controllers/muelleController.js
const { logMensaje } = require("../utils/logger.js");
const muelleService = require("../services/muelleService");

class MuelleController {

    async getMuelle(req, res) {
        const muelles = await muelleService.getMuelles(req.query);
        return res.status(200).json({ ok: true, datos: muelles, mensaje: "Muelles recuperados correctamente" });
    }

    async createMuelle(req, res) {
        const muelle = req.body;
        const muelleNew = await muelleService.createMuelle(muelle);
        return res.status(201).json({ ok: true, datos: muelleNew, mensaje: "Muelle creado correctamente" });
    }

    async deleteMuelle(req, res) {
        const id_muelle = req.params.id;
        const numFilas = await muelleService.deleteMuelle(id_muelle);
        if (numFilas == 0) return res.status(404).json({ ok: false, datos: null, mensaje: "Muelle no encontrado: " + id_muelle });
        return res.status(204).send();
    }

    async getMuelleById(req, res) {
        const id_muelle = req.params.id;
        const muelle = await muelleService.getMuelleById(id_muelle);
        return res.status(200).json({ ok: true, datos: muelle, mensaje: "Muelle recuperado correctamente" });
    }

    async updateMuelle(req, res) {
        const id = req.params.id;
        const data = req.body;
        const filas = await muelleService.updateMuelle(id, data);
        if (filas === 0) return res.status(404).json({ message: "Muelle no encontrado" });
        return res.json({ message: "Muelle actualizado correctamente" });
    }
}

module.exports = new MuelleController();