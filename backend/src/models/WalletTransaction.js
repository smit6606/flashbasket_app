const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const WalletTransaction = sequelize.define('WalletTransaction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('credit', 'debit'),
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  source: {
    type: DataTypes.ENUM('order', 'referral', 'first_order', 'checkout', 'add_money'),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  timestamps: true,
});

module.exports = WalletTransaction;
