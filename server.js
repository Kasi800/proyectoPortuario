const app = require("./app");
// Importamos sequelize (./models/index.js)
const { sequelize } = require("./models");
// Logger personalizado
const { logMensaje } = require("./utils/logger.js");
// Puerto del servidor
const port = process.env.PORT || 3000;

// Arranque del servidor y db
async function startServer() {
    try {
        await sequelize.authenticate();
        logMensaje("Conexión a la base de datos establecida correctamente.");
        
        app.listen(port, () => {
            logMensaje(`Servidor escuchando en el puerto ${port}`);
        });
    } catch (error) {
        console.error("Error de conexión con la base de datos:", error);
    }
}

startServer();