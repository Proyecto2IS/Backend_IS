const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/conexion');

const DocenteMateria = sequelize.define('docente_materia', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  docente_id: { type: DataTypes.INTEGER, allowNull: false },
  materia_id: { type: DataTypes.INTEGER, allowNull: false }
}, { timestamps: false });

module.exports = { DocenteMateria };
