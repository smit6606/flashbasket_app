const orderService = require('../services/orderService');
const responseHandler = require('../utils/responseHandler');
const messages = require('../utils/message');

class OrderController {
  async createOrder(req, res) {
    try {
      const result = await orderService.createOrder(req.user.id, req.body);
      return responseHandler.success(res, messages.ORDER.PLACE_SUCCESS, result, 201);
    } catch (error) {
      return responseHandler.badRequest(res, error.message || messages.COMMON.BAD_REQUEST);
    }
  }

  async getOrderHistory(req, res) {
    try {
      const result = await orderService.getOrderHistory(req.user.id);
      return responseHandler.success(res, messages.ORDER.FETCH_SUCCESS, result);
    } catch (error) {
      return responseHandler.error(res, error.message || messages.COMMON.SOMETHING_WENT_WRONG);
    }
  }

  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const result = await orderService.getOrderById(req.user.id, id);
      if (!result) {
        return responseHandler.notFound(res, messages.ORDER.NOT_FOUND);
      }
      return responseHandler.success(res, messages.ORDER.FETCH_SUCCESS, result);
    } catch (error) {
      return responseHandler.error(res, error.message || messages.COMMON.SOMETHING_WENT_WRONG);
    }
  }

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const result = await orderService.updateOrderStatus(id, status);
      return responseHandler.success(res, messages.ORDER.UPDATE_SUCCESS, result);
    } catch (error) {
      return responseHandler.badRequest(res, error.message || messages.COMMON.BAD_REQUEST);
    }
  }

  async getAllOrders(req, res) {
    try {
      const result = await orderService.getAllOrders();
      return responseHandler.success(res, messages.ORDER.FETCH_SUCCESS, result);
    } catch (error) {
      return responseHandler.error(res, error.message || messages.COMMON.SOMETHING_WENT_WRONG);
    }
  }
}

module.exports = new OrderController();
