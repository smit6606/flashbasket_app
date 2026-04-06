const { Order, OrderItem, Cart, CartItem, Product, Category, User, Address, Wallet, WalletTransaction, Coupon, sequelize } = require('../models');

class OrderService {
  async createOrder(userId, { addressId, paymentMethod, couponCode, useWallet }) {
    const t = await sequelize.transaction();
    try {
      const cart = await Cart.findOne({
        where: { userId },
        include: [{ model: CartItem, as: 'items', include: [{ model: Product, as: 'product' }] }]
      });

      if (!cart || cart.items.length === 0) throw new Error('Cart is empty');

      let subtotal = 0;
      cart.items.forEach(item => {
        subtotal += item.product.price * item.quantity;
      });

      let discount = 0;
      if (couponCode) {
        const coupon = await Coupon.findOne({ where: { code: couponCode, isActive: true } });
        if (coupon && subtotal >= coupon.minOrderAmount) {
          if (coupon.discountType === 'percentage') {
            discount = (subtotal * coupon.discountValue) / 100;
          } else {
            discount = coupon.discountValue;
          }
        }
      }

      const totalAmountBeforeWallet = subtotal - discount + deliveryCharge;

      let walletUsed = 0;
      let wallet = null;

      if (useWallet || paymentMethod === 'wallet') {
        wallet = await Wallet.findOne({ where: { userId } });
        if (wallet && wallet.balance > 0) {
          walletUsed = Math.min(wallet.balance, totalAmountBeforeWallet);
          wallet.balance -= walletUsed;
          await wallet.save({ transaction: t });

          await WalletTransaction.create({
            userId,
            type: 'debit',
            amount: walletUsed,
            source: 'checkout',
            description: `Wallet used for order`
          }, { transaction: t });
        }
      }

      const totalAmount = totalAmountBeforeWallet - walletUsed;

      if (paymentMethod === 'wallet' && totalAmount > 0) {
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
        status: 'Pending',
        pendingAt: new Date()
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

  async updateOrderStatus(orderId, nextStatus) {
    const order = await Order.findByPk(orderId);
    if (!order) throw new Error('Order not found');
    
    const statusOrder = ['Pending', 'Packed', 'Out for Delivery', 'Delivered'];
    const currentIndex = statusOrder.indexOf(order.status);
    const nextIndex = statusOrder.indexOf(nextStatus);

    if (order.status === 'Delivered') {
      throw new Error('Order is already Delivered and cannot be changed.');
    }

    // Restriction: Cannot skip steps, cannot go backward
    if (nextIndex !== currentIndex + 1) {
      throw new Error(`Invalid status transition from ${order.status} to ${nextStatus}. Order must follow: Pending -> Packed -> Out for Delivery -> Delivered`);
    }

    // Note: Delivered should ideally only be reached via verifyOrderOTP, 
    // but we allow it here if someone calls it, though the flow usually goes through OTP.
    const t = await sequelize.transaction();
    try {
      order.status = nextStatus;
      
      if (nextStatus === 'Out for Delivery') {
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        order.otp = otp;
        order.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); 
      }
      
      if (nextStatus === 'Pending') order.pendingAt = new Date();
      if (nextStatus === 'Packed') order.packedAt = new Date();
      if (nextStatus === 'Out for Delivery') order.outForDeliveryAt = new Date();
      if (nextStatus === 'Delivered') {
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
    if (order.rewardGiven) return;

    const user = await User.findByPk(order.userId, { transaction });
    if (!user) return;

    let wallet = await Wallet.findOne({ where: { userId: user.id }, transaction });
    if (!wallet) {
      wallet = await Wallet.create({ userId: user.id, balance: 0 }, { transaction });
    }

    // 1. Basic Order Reward
    wallet.balance += 10;
    await WalletTransaction.create({
      userId: user.id,
      type: 'credit',
      amount: 10,
      source: 'order',
      description: `Order reward for #${order.id}`
    }, { transaction });

    // 2. First Order Logic
    if (!user.firstOrderDelivered) {
      wallet.balance += 20;
      await WalletTransaction.create({
        userId: user.id,
        type: 'credit',
        amount: 20,
        source: 'first_order',
        description: 'First order bonus'
      }, { transaction });

      user.firstOrderDelivered = true;
      await user.save({ transaction });
    }

    await wallet.save({ transaction });
    order.rewardGiven = true;
  }

  async getAllOrders() {
    const orders = await Order.findAll({
      include: [{ model: OrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']]
    });
    return orders;
  }
}

module.exports = new OrderService();
