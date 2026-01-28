/*
 * server.js - Punto de entrada del servidor
 * Inicializa la aplicación Express y conecta con la base de datos
 */

const app = require("./app"); // Aplicación Express configurada
const { sequelize } = require("./models"); // ORM de base de datos
const { logMensaje } = require("./utils/logger.js"); // Logger personalizado
const { port } = require("./config/config.js"); // Configuración del puerto

/**
 * Inicia el servidor HTTP y autentica la conexión a la base de datos
 */
async function startServer() {
    try {
        // Verificar conexión a la base de datos
        await sequelize.authenticate();
        logMensaje("Conexión a la base de datos establecida correctamente.");

        // Iniciar servidor Express
        app.listen(port, () => {
            logMensaje(`Servidor escuchando en el puerto ${port}`);
        });
    } catch (error) {
        // Registrar errores de conexión
        console.error("Error de conexión con la base de datos:", error);
    }
}

// Ejecutar servidor
startServer();