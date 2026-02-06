const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/conexion');

const Tutoria = sequelize.define('tutorias', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  estudiante_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  docente_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  materia_id: {
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
  },

  tema: {
    type: DataTypes.TEXT
  },

  // 🔹 CUÁNTOS SE SOLICITARON (presidente / estudiante)
  numero_estudiantes_solicitados: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },

  // 🔹 CUÁNTOS ASISTIERON REALMENTE (docente)
  numero_estudiantes_asistieron: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  estado: {
    type: DataTypes.ENUM(
      'pendiente',
      'confirmada',
      'rechazada',
      'cancelada',
      'finalizada'
    ),
    defaultValue: 'pendiente'
  },

  motivo_cancelacion: {
    type: DataTypes.TEXT
  },

  creado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }

}, {
  timestamps: false
});

module.exports = { Tutoria };
