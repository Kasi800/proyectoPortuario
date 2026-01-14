// controllers/muelleController.js
const { logMensaje } = require("../utils/logger.js");
const muelleService = require("../services/muelleService");

class MuelleController {

    async getMuelle(req, res) {
        const muelles = await muelleService.getMuelles(req.query);
        return res.status(200).json({ ok: true, data: muelles, message: "Docks successfully recovered" });
    }

    async createMuelle(req, res) {
        const muelle = req.body;
        const muelleNew = await muelleService.createMuelle(muelle);
        return res.status(201).json({ ok: true, data: muelleNew, message: "Dock created correctly" });
    }

    async deleteMuelle(req, res) {
        const id_muelle = req.params.id;
        const numFilas = await muelleService.deleteMuelle(id_muelle);
        return res.status(204).send();
    }

    async getMuelleById(req, res) {
        const id_muelle = req.params.id;
        const muelle = await muelleService.getMuelleById(id_muelle);
        return res.status(200).json({ ok: true, data: muelle, message: "Dock recovered correctly" });
    }

    async updateMuelle(req, res) {
        const id = req.params.id;
        const data = req.body;
        const filas = await muelleService.updateMuelle(id, data);
        return res.json({ ok: true, data: filas, message: "Dock updated correctly" });
    }
}

module.exports = new MuelleController();