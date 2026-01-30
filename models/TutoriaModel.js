const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/conexion");
const { UsuarioModel } = require("./UsuarioModel");
const { MateriaModel } = require("./MateriaModel");

const TutoriaModel = sequelize.define("tutorias", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subject_id: {
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
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending",
  },
}, {
  timestamps: false,
});

// RELACIONES
UsuarioModel.hasMany(TutoriaModel, { foreignKey: "student_id" });
UsuarioModel.hasMany(TutoriaModel, { foreignKey: "teacher_id" });

TutoriaModel.belongsTo(UsuarioModel, { foreignKey: "student_id", as: "student" });
TutoriaModel.belongsTo(UsuarioModel, { foreignKey: "teacher_id", as: "teacher" });

MateriaModel.hasMany(TutoriaModel, { foreignKey: "subject_id" });
TutoriaModel.belongsTo(MateriaModel, { foreignKey: "subject_id" });

module.exports = { TutoriaModel };
