const { Sequelize } = require('sequelize');
const {
  DB_CONNECTION,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_DATABASE
} = require('../config/config.js');

const sequelize = new Sequelize(
  DB_DATABASE,
  DB_USERNAME,
  DB_PASSWORD,
  {
    host: DB_HOST,
    dialect: DB_CONNECTION
  }
);

module.exports = { sequelize };
