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
      return { ...cart.toJSON(), items: [] };
    }

    return cart;
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

    return { cartId: cart.id, productId, quantity: item.quantity };
  }

  async updateCartItem(userId, itemId, quantity) {
    const item = await CartItem.findByPk(itemId, {
      include: [{ 
        model: Cart, 
        where: { userId }, // Security: Ensure item belongs to user
        required: true 
      }]
    });
    
    if (!item) throw new Error('Cart item not found or unauthorized');
    if (quantity <= 0) {
      await item.destroy();
    } else {
      item.quantity = quantity;
      await item.save();
    }
    return true;
  }

  async removeFromCart(userId, itemId) {
    const item = await CartItem.findByPk(itemId);
    if (!item) throw new Error('Cart item not found');
    await item.destroy();
    return true;
  }

  async clearCart(userId) {
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) return true; // Already empty (or no cart)
    
    await CartItem.destroy({ where: { cartId: cart.id } });
    return true;
  }
}

module.exports = new CartService();
