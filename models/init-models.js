var DataTypes = require("sequelize").DataTypes;
var _muelle = require("./muelle");
var _puerto = require("./puerto");

function initModels(sequelize) {
  var muelle = _muelle(sequelize, DataTypes);
  var puerto = _puerto(sequelize, DataTypes);

  muelle.belongsTo(puerto, { as: "id_puerto_puerto", foreignKey: "id_puerto"});
  puerto.hasMany(muelle, { as: "muelles", foreignKey: "id_puerto"});

  return {
    muelle,
    puerto,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
