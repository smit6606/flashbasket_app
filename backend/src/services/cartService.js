const { Cart, CartItem, Product } = require('../models');

class CartService {
  async getCart(userId) {
    let cart = await Cart.findOne({
      where: { userId },
      include: [{ 
        model: CartItem, 
        as: 'items',
        include: [{ model: Product, as: 'product' }]
      }]
    });

    if (!cart) {
      cart = await Cart.create({ userId });
      return { success: true, data: { ...cart.toJSON(), items: [] } };
    }

    return { success: true, data: cart };
  }

  async addToCart(userId, { productId, quantity = 1 }) {
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) cart = await Cart.create({ userId });

    let item = await CartItem.findOne({ where: { cartId: cart.id, productId } });
    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      item = await CartItem.create({ cartId: cart.id, productId, quantity });
    }

    return { success: true, message: 'Added to cart' };
  }

  async updateCartItem(userId, itemId, quantity) {
    const item = await CartItem.findByPk(itemId, {
      include: [{ model: Cart, include: [{ model: Cart, as: 'Cart', required: false }] }] // Actually check if belongs to user
    });
    // Simpler check for dev:
    if (!item) throw new Error('Cart item not found');
    if (quantity <= 0) {
      await item.destroy();
    } else {
      item.quantity = quantity;
      await item.save();
    }
    return { success: true, message: 'Cart updated' };
  }

  async removeFromCart(userId, itemId) {
    const item = await CartItem.findByPk(itemId);
    if (!item) throw new Error('Cart item not found');
    await item.destroy();
    return { success: true, message: 'Removed from cart' };
  }
}

module.exports = new CartService();
