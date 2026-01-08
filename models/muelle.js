const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('muelle', {
    id_muelle: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_puerto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'puerto',
        key: 'id_puerto'
      }
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    longitud_m: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    calado_m: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false
    },
    operativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
    fecha_construccion: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    tipo: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'muelle',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_muelle" },
        ]
      },
      {
        name: "id_puerto",
        using: "BTREE",
        fields: [
          { name: "id_puerto" },
        ]
      },
    ]
  });
};
