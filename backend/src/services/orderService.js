const { Order, OrderItem, Cart, CartItem, Product, Address, Wallet, Coupon, sequelize } = require('../models');

class OrderService {
  async createOrder(userId, { addressId, paymentMethod, couponCode }) {
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

      const deliveryCharge = subtotal > 500 ? 0 : 25;
      const totalAmount = subtotal - discount + deliveryCharge;

      // Check wallet balance if payment method is wallet
      if (paymentMethod === 'wallet') {
        const wallet = await Wallet.findOne({ where: { userId } });
        if (!wallet || wallet.balance < totalAmount) {
          throw new Error('Insufficient wallet balance');
        }
        wallet.balance -= totalAmount;
        await wallet.save({ transaction: t });
      }

      const orderId = `FB-${Date.now()}`;
      const order = await Order.create({
        id: orderId,
        userId,
        subtotal,
        discount,
        deliveryCharge,
        totalAmount,
        paymentMethod,
        addressId,
        status: 'Placed'
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

  async getOrderById(userId, orderId) {
    const order = await Order.findOne({
      where: { id: orderId, userId },
      include: [
        { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] },
        { model: Address, as: 'deliveryAddress' }
      ]
    });
    if (!order) throw new Error('Order not found');
    return order;
  }

  async updateOrderStatus(orderId, status) {
    const order = await Order.findByPk(orderId);
    if (!order) throw new Error('Order not found');
    order.status = status;
    await order.save();
    return order;
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
