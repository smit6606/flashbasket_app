const addressService = require('../services/addressService');
const responseHandler = require('../utils/responseHandler');
const messages = require('../utils/message');

class AddressController {
  async getAddresses(req, res) {
    try {
      const result = await addressService.getAddresses(req.user.id);
      return responseHandler.success(res, 'Addresses fetched', result);
    } catch (error) {
      return responseHandler.error(res, error.message || messages.COMMON.SOMETHING_WENT_WRONG);
    }
  }

  async createAddress(req, res) {
    try {
      const result = await addressService.createAddress(req.user.id, req.body);
      return responseHandler.success(res, 'Address created', result, 201);
    } catch (error) {
      return responseHandler.badRequest(res, error.message || messages.COMMON.BAD_REQUEST);
    }
  }

  async updateAddress(req, res) {
    try {
      const { id } = req.params;
      const result = await addressService.updateAddress(req.user.id, id, req.body);
      return responseHandler.success(res, 'Address updated', result);
    } catch (error) {
      return responseHandler.badRequest(res, error.message || messages.COMMON.BAD_REQUEST);
    }
  }

  async deleteAddress(req, res) {
    try {
      const { id } = req.params;
      const result = await addressService.deleteAddress(req.user.id, id);
      return responseHandler.success(res, 'Address deleted', result);
    } catch (error) {
      return responseHandler.notFound(res, error.message || messages.COMMON.NOT_FOUND);
    }
  }
}

module.exports = new AddressController();
