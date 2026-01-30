const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/conexion");
const { UsuarioModel } = require("./UsuarioModel");
const { MateriaModel } = require("./MateriaModel");

const DocenteMateriaModel = sequelize.define("docente_materia", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subject_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: false,
});

// RELACIONES
UsuarioModel.belongsToMany(MateriaModel, {
  through: DocenteMateriaModel,
  foreignKey: "teacher_id",
});

MateriaModel.belongsToMany(UsuarioModel, {
  through: DocenteMateriaModel,
  foreignKey: "subject_id",
});

module.exports = { DocenteMateriaModel };
