const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/conexion');

const Usuario = sequelize.define('usuarios', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  rol: { type: DataTypes.ENUM('estudiante', 'docente'), allowNull: false },
  creado_en: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { timestamps: false });

module.exports = { Usuario };
