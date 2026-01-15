// models/index.js
const sequelize = require('../config/sequelize');
const initModels = require('./init-models');

// Inicializamos los modelos una sola vez
const models = initModels(sequelize);

module.exports = {
    sequelize,
    ...models // Exportamos los modelos
};