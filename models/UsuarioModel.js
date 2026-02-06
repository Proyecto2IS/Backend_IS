const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/conexion");

const UsuarioModel = sequelize.define("usuarios", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("student", "teacher", "admin"),
    allowNull: false,
  },
}, {
  timestamps: false,
});

module.exports = { UsuarioModel };
