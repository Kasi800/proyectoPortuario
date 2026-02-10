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
        const server = app.listen(port, () => {
            logMensaje(`Servidor escuchando en el puerto ${port}`);
        });

        process.on('SIGTERM', () => {
            logMensaje('Recibida señal SIGTERM, cerrando servidor...');
            server.close(async () => {
                await sequelize.close();
                process.exit(0);
            });
        });
    } catch (error) {
        // Registrar errores de conexión
        console.error("Error de conexión con la base de datos:", error);

        console.log('Reintentando conexion en 10 segundos...');
        setTimeout(startServer, 10000);
    }
}

// Ejecutar servidor
startServer();