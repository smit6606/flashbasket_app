const { Order, OrderItem, Cart, CartItem, Product, Category, User, Address, Wallet, WalletTransaction, Coupon, sequelize } = require('../models');

const { 
  ORDER_STATUS, 
  ORDER_STATUS_FLOW, 
  PAYMENT_METHODS, 
  WALLET_TRANSACTION_TYPES, 
  WALLET_SOURCES 
} = require('../utils/constants');

class OrderService {
  async createOrder(userId, { addressId, paymentMethod, couponCode, useWallet, stripePaymentIntentId }) {
    const t = await sequelize.transaction();
    try {
      const cart = await Cart.findOne({
        where: { userId },
        include: [{ model: CartItem, as: 'items', include: [{ model: Product, as: 'product' }] }]
      });

      if (!cart || cart.items.length === 0) throw new Error('Cart is empty');

      // Backend calculation - SINGLE SOURCE OF TRUTH
      const subtotal = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      
      let discount = 0;
      if (couponCode) {
        const coupon = await Coupon.findOne({ where: { code: couponCode, isActive: true } });
        if (coupon && subtotal >= coupon.minOrderAmount) {
          if (coupon.discountType === 'percentage') {
            discount = Math.round((subtotal * coupon.discountValue) / 100);
          } else {
            discount = coupon.discountValue;
          }
        }
      }

      // Exact match with frontend priceUtils.js
      const DELIVERY_THRESHOLD = 500;
      const DELIVERY_FEE = 25;
      const HANDLING_FEE = 5;

      const deliveryFee = (subtotal === 0 || subtotal > DELIVERY_THRESHOLD) ? 0 : DELIVERY_FEE;
      const handlingFee = subtotal > 0 ? HANDLING_FEE : 0;
      const deliveryCharge = deliveryFee + handlingFee;

      const baseAmount = subtotal - discount + deliveryCharge;
      
      let walletUsed = 0;
      let wallet = null;

      if (useWallet || paymentMethod === PAYMENT_METHODS.WALLET) {
        wallet = await Wallet.findOne({ 
          where: { userId }, 
          transaction: t, 
          lock: t.LOCK.UPDATE 
        });
        if (wallet && wallet.balance > 0) {
          walletUsed = Math.min(wallet.balance, baseAmount);
          
          if (walletUsed > 0) {
            wallet.balance -= walletUsed;
            await wallet.save({ transaction: t });

            await WalletTransaction.create({
              userId,
              type: WALLET_TRANSACTION_TYPES.DEBIT,
              amount: walletUsed,
              source: WALLET_SOURCES.CHECKOUT,
              description: `Wallet used for order`
            }, { transaction: t });
          }
        }
      }

      const totalAmount = Math.max(0, baseAmount - walletUsed);

      if (paymentMethod === PAYMENT_METHODS.WALLET && totalAmount > 0) {
        throw new Error('Insufficient wallet balance to cover the full order');
      }

      const orderId = `FB-${Date.now()}`;
      
      const user = await User.findByPk(userId);
      const address = await Address.findByPk(addressId);
      
      if (!user) throw new Error('User not found');
      if (!address) throw new Error('Address not found');

      const fullAddressStr = `${address.houseNo}, ${address.landmark ? address.landmark + ', ' : ''}${address.fullAddress} (${address.type})`;

      const order = await Order.create({
        id: orderId,
        userId,
        userName: user.name || 'User',
        userPhone: user.phone,
        userEmail: user.email,
        fullAddress: fullAddressStr,
        subtotal,
        discount,
        deliveryCharge,
        totalAmount,
        walletUsed,
        paymentMethod,
        addressId,
        status: (paymentMethod === PAYMENT_METHODS.ONLINE || paymentMethod === PAYMENT_METHODS.WALLET) ? ORDER_STATUS.PLACED : ORDER_STATUS.PENDING,
        pendingAt: new Date(),
        placedAt: (paymentMethod === PAYMENT_METHODS.ONLINE || paymentMethod === PAYMENT_METHODS.WALLET) ? new Date() : null,
        stripePaymentIntentId: stripePaymentIntentId || null
      }, { transaction: t });

      const orderItems = cart.items.map(item => ({
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price
      }));

      await OrderItem.bulkCreate(orderItems, { transaction: t });

      // Clear Cart
      await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });

      await t.commit();
      return order;

    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async getOrderHistory(userId) {
    const orders = await Order.findAll({
      where: { userId },
      include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
      order: [['createdAt', 'DESC']]
    });
    return orders;
  }

  async getOrderById(orderId, userId = null) {
    const where = { id: orderId };
    if (userId) {
      where.userId = userId;
    }

    const order = await Order.findOne({
      where,
      include: [
        { 
          model: OrderItem, 
          as: 'items', 
          include: [{ 
            model: Product, 
            as: 'product',
            include: [{ model: Category, as: 'category' }]
          }] 
        },
        { model: Address, as: 'deliveryAddress' }
      ]
    });
    if (!order) throw new Error('Order not found');
    return order;
  }

  async getBuyAgainProducts(userId) {
    const orders = await Order.findAll({
      where: { userId },
      limit: 20,
      include: [{ 
        model: OrderItem, 
        as: 'items', 
        include: [{ 
          model: Product, 
          as: 'product',
          include: [{ model: Category, as: 'category' }] 
        }] 
      }],
      order: [['createdAt', 'DESC']]
    });

    const productCounts = {};
    const productDetails = {};

    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.product) {
          const productId = item.product.id;
          productCounts[productId] = (productCounts[productId] || 0) + 1;
          if (!productDetails[productId]) {
            productDetails[productId] = item.product;
          }
        }
      });
    });

    const buyAgain = Object.keys(productCounts)
      .map(id => ({
        ...productDetails[id].toJSON(),
        frequency: productCounts[id],
        lastOrdered: orders.find(o => o.items.some(i => i.productId == id)).createdAt
      }))
      .sort((a, b) => {
        if (b.frequency !== a.frequency) {
          return b.frequency - a.frequency; // Most ordered first
        }
        return new Date(b.lastOrdered) - new Date(a.lastOrdered); // Then recently ordered
      });

    return buyAgain;
  }

  async updateOrderStatus(orderId, nextStatus) {
    const order = await Order.findByPk(orderId);
    if (!order) throw new Error('Order not found');
    
    const currentIndex = ORDER_STATUS_FLOW.indexOf(order.status);
    const nextIndex = ORDER_STATUS_FLOW.indexOf(nextStatus);

    if (order.status === ORDER_STATUS.DELIVERED) {
      throw new Error('Order is already Delivered and cannot be changed.');
    }

    // Restriction: Cannot skip steps, cannot go backward
    if (nextIndex !== currentIndex + 1) {
      throw new Error(`Invalid status transition from ${order.status} to ${nextStatus}. Order must follow: Pending -> Placed -> Packed -> Out for Delivery -> Delivered`);
    }

    const t = await sequelize.transaction();
    try {
      order.status = nextStatus;
      
      if (nextStatus === ORDER_STATUS.OUT_FOR_DELIVERY) {
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        order.otp = otp;
        order.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); 
      }
      
      if (nextStatus === ORDER_STATUS.PENDING) order.pendingAt = new Date();
      if (nextStatus === ORDER_STATUS.PLACED) order.placedAt = new Date();
      if (nextStatus === ORDER_STATUS.PACKED) order.packedAt = new Date();
      if (nextStatus === ORDER_STATUS.OUT_FOR_DELIVERY) order.outForDeliveryAt = new Date();
      if (nextStatus === ORDER_STATUS.DELIVERED) {
        order.deliveredAt = new Date();
        await this._distributeRewards(order, t);
      }
      
      await order.save({ transaction: t });
      await t.commit();
      return order;
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }


  async verifyOrderOTP(orderId, enteredOTP) {
    const order = await Order.findByPk(orderId);
    if (!order) throw new Error('Order not found');
    
    if (order.status !== 'Out for Delivery') {
      throw new Error('OTP can only be verified for orders out for delivery');
    }

    if (order.otpExpiresAt && new Date() > new Date(order.otpExpiresAt)) {
      throw new Error('OTP has expired');
    }
    
    if (order.otp === enteredOTP) {
      const t = await sequelize.transaction();
      try {
        order.status = 'Delivered';
        order.deliveredAt = new Date();
        order.otp = null; 
        order.otpExpiresAt = null;
        
        await this._distributeRewards(order, t);
        
        await order.save({ transaction: t });
        await t.commit();
        return { success: true, order };
      } catch (e) {
        await t.rollback();
        throw e;
      }
    } else {
      throw new Error('Invalid OTP');
    }
  }

  async _distributeRewards(order, transaction) {
    if (order.cashbackGiven) return;

    const user = await User.findByPk(order.userId, { transaction });
    if (!user || user.role === 'admin') return;

    let wallet = await Wallet.findOne({ where: { userId: user.id }, transaction });
    if (!wallet) {
      wallet = await Wallet.create({ userId: user.id, balance: 0 }, { transaction });
    }

    let cashbackAmount = 0;
    let cashbackSource = '';
    let cashbackDesc = '';

    // CASE 1: FIRST ORDER (₹20 cashback)
    if (!user.firstOrderDone) {
      cashbackAmount = 20;
      cashbackSource = WALLET_SOURCES.FIRST_ORDER;
      cashbackDesc = 'First order bonus';
      
      user.firstOrderDone = true;
      await user.save({ transaction });
    } 
    // CASE 2: NORMAL ORDER (₹10 cashback if order value >= 100)
    else if ((order.totalAmount + order.walletUsed) >= 100) {
      cashbackAmount = 10;
      cashbackSource = WALLET_SOURCES.ORDER;
      cashbackDesc = `Cashback for order #${order.id}`;
    }

    if (cashbackAmount > 0) {
      wallet.balance += cashbackAmount;
      await wallet.save({ transaction });
      await WalletTransaction.create({
        userId: user.id,
        type: WALLET_TRANSACTION_TYPES.CREDIT,
        amount: cashbackAmount,
        source: cashbackSource,
        description: cashbackDesc
      }, { transaction });
    }

    order.cashbackGiven = true;
  }

  async getAllOrders() {
    const orders = await Order.findAll({
      include: [{ model: OrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']]
    });
    return orders;
  }

  /**
   * Secured calculation of order amount for payment intents
   */
  async calculateRequiredPayment(userId, { couponCode, useWallet }) {
    const cart = await Cart.findOne({
      where: { userId },
      include: [{ model: CartItem, as: 'items', include: [{ model: Product, as: 'product' }] }]
    });

    if (!cart || cart.items.length === 0) return 0;

    const subtotal = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ where: { code: couponCode, isActive: true } });
      if (coupon && subtotal >= coupon.minOrderAmount) {
        if (coupon.discountType === 'percentage') {
          discount = Math.round((subtotal * coupon.discountValue) / 100);
        } else {
          discount = coupon.discountValue;
        }
      }
    }

    const DELIVERY_THRESHOLD = 500;
    const DELIVERY_FEE = 25;
    const HANDLING_FEE = 5;

    const deliveryFee = (subtotal === 0 || subtotal > DELIVERY_THRESHOLD) ? 0 : DELIVERY_FEE;
    const handlingFee = subtotal > 0 ? HANDLING_FEE : 0;
    const deliveryCharge = deliveryFee + handlingFee;

    const baseAmount = subtotal - discount + deliveryCharge;
    
    let walletUsed = 0;
    if (useWallet) {
      const wallet = await Wallet.findOne({ where: { userId } });
      if (wallet) {
        walletUsed = Math.min(wallet.balance, baseAmount);
      }
    }

    return Math.max(0, baseAmount - walletUsed);
  }
}


module.exports = new OrderService();
