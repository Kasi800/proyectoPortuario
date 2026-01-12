const queryValidator = require("./queryValidator");
const models = require("../models/init-models")(require("../config/sequelize"));

const puertoQueryValidator = queryValidator(models.puerto);
module.exports = puertoQueryValidator;