const walletService = require('../services/walletService');
const responseHandler = require('../utils/responseHandler');
const messages = require('../utils/message');

class WalletController {
  async getWallet(req, res) {
    try {
      const result = await walletService.getWallet(req.user.id);
      return responseHandler.success(res, 'Wallet balance fetched', result);
    } catch (error) {
      return responseHandler.error(res, error.message || messages.COMMON.SOMETHING_WENT_WRONG);
    }
  }

  async addMoney(req, res) {
    try {
      const { amount } = req.body;
      const result = await walletService.addMoney(req.user.id, amount);
      return responseHandler.success(res, 'Money added to wallet', result);
    } catch (error) {
      return responseHandler.badRequest(res, error.message || messages.COMMON.BAD_REQUEST);
    }
  }

  async getHistory(req, res) {
    try {
      const result = await walletService.getHistory(req.user.id);
      return responseHandler.success(res, 'Wallet history fetched', result);
    } catch (error) {
      return responseHandler.error(res, error.message || messages.COMMON.SOMETHING_WENT_WRONG);
    }
  }
}

module.exports = new WalletController();
