import api from './api';

const cartService = {
  getCart: async () => {
    return api.get('/cart');
  },

  addToCart: async (productId, quantity = 1) => {
    return api.post('/cart/add', { productId, quantity });
  },

  updateCartQuantity: async (cartItemId, quantity) => {
    return api.put(`/cart/update/${cartItemId}`, { quantity });
  },

  removeFromCart: async (cartItemId) => {
    return api.delete(`/cart/remove/${cartItemId}`);
  },

  clearCart: async () => {
    return api.delete('/cart/clear');
  }
};

export default cartService;
