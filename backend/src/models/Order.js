const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userPhone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fullAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  subtotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  discount: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  deliveryCharge: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Placed', 'Packed', 'Out for Delivery', 'Delivered'),
    defaultValue: 'Pending',
  },
  paymentMethod: {
    type: DataTypes.ENUM('cod', 'upi', 'card', 'wallet', 'online'),
    defaultValue: 'cod',
  },
  addressId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  otpExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  pendingAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  placedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  packedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  outForDeliveryAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  cashbackGiven: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  walletUsed: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  stripePaymentIntentId: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  timestamps: true,
});

module.exports = Order;
