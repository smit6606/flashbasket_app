require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'flashbasket',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'YourPassword123',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    logging: false,
  }
);

module.exports = sequelize;
