const queryValidator = require("./queryValidator");
const models = require("../models/init-models")(require("../config/sequelize"));

const muelleQueryValidator = queryValidator(models.muelle);
module.exports = muelleQueryValidator;