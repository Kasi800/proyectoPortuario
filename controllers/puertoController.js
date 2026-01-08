// controllers/puertoController.js
const { logMensaje } = require("../utils/logger.js");
const puertoService = require("../services/puertoService");

class PuertoController {

    async getPuertos(req, res) {
        try {
            const puertos = await puertoService.getPuertos(req.query);
            return res.status(200).json({
                ok: true,
                datos: puertos,
                mensaje: "Puertos recuperados correctamente",
            });
        } catch (err) {
            logMensaje("Error en getAllPuertos:", err);
            return res.status(500).json({
                ok: false,
                datos: null,
                mensaje: "Error al recuperar Puertos",
            });
        }
    }

    async createPuerto(req, res) {
        const puerto = req.body;

        try {
            const puertoNew = await puertoService.createPuerto(puerto);

            return res.status(201).json({
                ok: true,
                datos: puertoNew,
                mensaje: "Puerto creado correctamente",
            });
        } catch (err) {
            logMensaje("Error en createPuerto:", err);
            return res.status(500).json({
                ok: false,
                datos: null,
                mensaje: "Error al crear un Puerto",
            });
        }
    }

    async deletePuerto(req, res) {
        const id_puerto = req.params.id;

        try {
            const numFilas = await puertoService.deletePuerto(id_puerto);

            if (numFilas == 0) {
                return res.status(404).json({
                    ok: false,
                    datos: null,
                    mensaje: "Puerto no encontrado: " + id_puerto,
                });
            } else {
                // Borrado correcto
                return res.status(204).send();
            }
        } catch (err) {
            logMensaje("Error en deletePuerto:", err);
            return res.status(500).json({
                ok: false,
                datos: null,
                mensaje: "Error al borrar un Puerto",
            });
        }
    }

    async getPuertoById(req, res) {
        const id_puerto = req.params.id;
        try {
            const puerto = await puertoService.getPuertoById(id_puerto);
            // Puerto != null -- se ha encontrado el puerto
            if (puerto) {
                return res.status(200).json({
                    ok: true,
                    datos: puerto,
                    mensaje: "Puerto recuperado correctamente",
                });
            } else {
                return res.status(404).json({
                    ok: false,
                    datos: null,
                    mensaje: "Puerto no encontrado",
                });
            }
        } catch (err) {
            logMensaje("Error en getPuertoById:", err);
            return res.status(500).json({
                ok: false,
                datos: null,
                mensaje: "Error al recuperar un Puerto",
            });
        }
    }

    async updatePuerto(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;
            const filas = await puertoService.updatePuerto(id, data);

            if (filas === 0) {
                return res.status(404).json({ message: "Puerto no encontrado" });
            }

            res.json({ message: "Puerto actualizado correctamente" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new PuertoController();
