const app = require("./app");
// Logger personalizado
const { logMensaje } = require("./utils/logger.js");
// Puerto del servidor
const port = process.env.PORT || 3000;

// Arranque del servidor
app.listen(port, () => {
    logMensaje(`Servidor escuchando en el puerto ${port}`);
});