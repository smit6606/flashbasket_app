const cartService = require('../services/cartService');
const responseHandler = require('../utils/responseHandler');
const messages = require('../utils/message');

class CartController {
  async getCart(req, res) {
    console.log('[BACKEND-DEBUG] getCart called for user:', req.user.id);
    try {
      const result = await cartService.getCart(req.user.id);
      console.log('[BACKEND-DEBUG] getCart success for user:', req.user.id);
      return responseHandler.success(res, messages.CART.FETCH_SUCCESS || 'Cart fetched', result);
    } catch (error) {
      console.error('[BACKEND-DEBUG] getCart error:', error);
      return responseHandler.error(res, error.message || messages.COMMON.SOMETHING_WENT_WRONG);
    }
  }

  async addToCart(req, res) {
    console.log('[BACKEND-DEBUG] addToCart called for user:', req.user.id, 'Payload:', req.body);
    try {
      const result = await cartService.addToCart(req.user.id, req.body);
      console.log('[BACKEND-DEBUG] addToCart success for user:', req.user.id);
      return responseHandler.success(res, messages.CART.ADD_SUCCESS, result);
    } catch (error) {
      console.error('[BACKEND-DEBUG] addToCart error:', error);
      return responseHandler.badRequest(res, error.message || messages.COMMON.BAD_REQUEST);
    }
  }

  async updateCartItem(req, res) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const result = await cartService.updateCartItem(req.user.id, id, quantity);
      return responseHandler.success(res, messages.CART.UPDATE_SUCCESS, result);
    } catch (error) {
      return responseHandler.badRequest(res, error.message || messages.COMMON.BAD_REQUEST);
    }
  }

  async removeFromCart(req, res) {
    try {
      const { id } = req.params;
      const result = await cartService.removeFromCart(req.user.id, id);
      return responseHandler.success(res, messages.CART.REMOVE_SUCCESS, result);
    } catch (error) {
      return responseHandler.notFound(res, error.message || messages.COMMON.NOT_FOUND);
    }
  }

  async clearCart(req, res) {
    try {
      const result = await cartService.clearCart(req.user.id);
      return responseHandler.success(res, messages.CART.CLEAR_SUCCESS || 'Cart cleared', result);
    } catch (error) {
      console.error('[BACKEND-DEBUG] clearCart error:', error);
      return responseHandler.error(res, error.message || messages.COMMON.SOMETHING_WENT_WRONG);
    }
  }
}

module.exports = new CartController();
