const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/conexion');

const Materia = sequelize.define('materias', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false }
}, { timestamps: false });

module.exports = { Materia };
