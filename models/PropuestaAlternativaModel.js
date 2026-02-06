const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/conexion');

const PropuestaAlternativa = sequelize.define(
  'PropuestaAlternativa',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    propuesta_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    hora_inicio: {
      type: DataTypes.TIME,
      allowNull: false
    },
    hora_fin: {
      type: DataTypes.TIME,
      allowNull: false
    }
  },
  {
    tableName: 'propuestas_alternativas',
    timestamps: false
  }
);

module.exports = { PropuestaAlternativa };
