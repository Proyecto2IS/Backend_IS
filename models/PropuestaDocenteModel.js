const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/conexion');

const PropuestaDocente = sequelize.define(
  'PropuestaDocente',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tutoria_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    tableName: 'propuestas_docente', // 🔥 CLAVE
    timestamps: false
  }
);

module.exports = { PropuestaDocente };
