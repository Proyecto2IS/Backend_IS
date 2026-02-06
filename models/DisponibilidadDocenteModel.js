const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/conexion');

const DisponibilidadDocente = sequelize.define('disponibilidad_docente', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  docente_id: { type: DataTypes.INTEGER, allowNull: false },
  dia_semana: {
    type: DataTypes.ENUM('Lunes','Martes','Miercoles','Jueves','Viernes'),
    allowNull: false
  },
  hora_inicio: { type: DataTypes.TIME, allowNull: false },
  hora_fin: { type: DataTypes.TIME, allowNull: false }
}, { timestamps: false });

module.exports = { DisponibilidadDocente };
