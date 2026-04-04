const cartService = require('../services/cartService');
const responseHandler = require('../utils/responseHandler');
const messages = require('../utils/message');

class CartController {
  async getCart(req, res) {
    try {
      const result = await cartService.getCart(req.user.id);
      return responseHandler.success(res, messages.CART.FETCH_SUCCESS || 'Cart fetched', result);
    } catch (error) {
      return responseHandler.error(res, error.message || messages.COMMON.SOMETHING_WENT_WRONG);
    }
  }

  async addToCart(req, res) {
    try {
      const result = await cartService.addToCart(req.user.id, req.body);
      return responseHandler.success(res, messages.CART.ADD_SUCCESS, result);
    } catch (error) {
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
}

module.exports = new CartController();
