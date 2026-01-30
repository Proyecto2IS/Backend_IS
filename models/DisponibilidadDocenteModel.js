const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/conexion");
const { UsuarioModel } = require("./UsuarioModel");

const DisponibilidadDocenteModel = sequelize.define("disponibilidad_docente", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("available", "occupied"),
    defaultValue: "available",
  },
}, {
  timestamps: false,
});

// RELACIÓN
UsuarioModel.hasMany(DisponibilidadDocenteModel, { foreignKey: "teacher_id" });
DisponibilidadDocenteModel.belongsTo(UsuarioModel, { foreignKey: "teacher_id" });

module.exports = { DisponibilidadDocenteModel };
