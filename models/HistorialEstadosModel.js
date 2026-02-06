const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/conexion');

const HistorialEstados = sequelize.define('historial_estados', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tutoria_id: { type: DataTypes.INTEGER, allowNull: false },
  estado_anterior: { type: DataTypes.STRING(50) },
  estado_nuevo: { type: DataTypes.STRING(50) },
  fecha_cambio: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { timestamps: false });

module.exports = { HistorialEstados };
