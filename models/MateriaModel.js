const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/conexion");

const MateriaModel = sequelize.define("materias", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  timestamps: false,
});

module.exports = { MateriaModel };
