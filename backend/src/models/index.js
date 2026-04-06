const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Product = require('./Product');
const Category = require('./Category');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Address = require('./Address');
const Wallet = require('./Wallet');
const Favorite = require('./Favorite');
const Coupon = require('./Coupon');
const Subcategory = require('./Subcategory');
const WalletTransaction = require('./WalletTransaction');

// User & WalletTransaction
User.hasMany(WalletTransaction, { foreignKey: 'userId', as: 'transactions' });
WalletTransaction.belongsTo(User, { foreignKey: 'userId' });

// User & Address
User.hasMany(Address, { foreignKey: 'userId', as: 'addresses' });
Address.belongsTo(User, { foreignKey: 'userId' });

// User & Wallet
User.hasOne(Wallet, { foreignKey: 'userId', as: 'wallet' });
Wallet.belongsTo(User, { foreignKey: 'userId' });

// User & Cart
User.hasOne(Cart, { foreignKey: 'userId', as: 'cart' });
Cart.belongsTo(User, { foreignKey: 'userId' });

// User & Orders
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User & Favorites
User.hasMany(Favorite, { foreignKey: 'userId', as: 'favorites' });
Favorite.belongsTo(User, { foreignKey: 'userId' });

// Category & Product
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Category & Subcategory
Category.hasMany(Subcategory, { foreignKey: 'categoryId', as: 'subcategories' });
Subcategory.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Subcategory & Product
Subcategory.hasMany(Product, { foreignKey: 'subcategoryId', as: 'products' });
Product.belongsTo(Subcategory, { foreignKey: 'subcategoryId', as: 'subcategory' });

// Cart & CartItem
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

// Product & CartItem
Product.hasMany(CartItem, { foreignKey: 'productId' });
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Order & OrderItem
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

// Product & OrderItem
Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Product & Favorite
Product.hasMany(Favorite, { foreignKey: 'productId' });
Favorite.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Order & Address
Address.hasMany(Order, { foreignKey: 'addressId' });
Order.belongsTo(Address, { foreignKey: 'addressId', as: 'deliveryAddress' });

module.exports = {
  User,
  Product,
  Category,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Address,
  Wallet,
  Favorite,
  Coupon,
  Subcategory,
  WalletTransaction,
  sequelize,
  Sequelize
};
