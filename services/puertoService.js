// services/puertoService.js
// Servicio para interactuar con el modelo Sequelize `puerto`

// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js").initModels;
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");
const { logMensaje } = require("../utils/logger.js");
// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);
// Recuperar el modelo puerto
const Puerto = models.puerto;

class PuertoService {

    async getPuertos(queryParams) {
        // Devuelve todos los Puertos que coincidan con el filtro.
        const where = {};
        for (const key in queryParams) {
            let value = queryParams[key];

            // Convertir booleanos 
            if (value === "true") value = true;
            if (value === "false") value = false;

            // Añadir al where
            where[key] = value;
        }
        const result = await Puerto.findAll({ where });
        return result;
    }

    async getPuertoById(id_puerto) {
        // Devuelve un Puerto por su id
        const result = await Puerto.findByPk(id_puerto);
        return result;
    }

    async createPuerto(puerto) {
        //Crea un Puerto
        const result = await Puerto.create(puerto);
        return result;
    }

    async updatePuerto(id_puerto, data) {
        // Actualiza un puerto
        const [numFilas] = await Puerto.update(data, { where: { id_puerto: id_puerto } });
        return numFilas; // 0 = no actualizado, 1 = actualizado 
    }

    async deletePuerto(id_puerto) {
        //Borrar un Puerto
        const numFilas = await Puerto.destroy({
            where: { id_puerto: id_puerto },
        });
        return numFilas;
    }
}

module.exports = new PuertoService();