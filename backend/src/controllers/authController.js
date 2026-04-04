const authService = require('../services/authService');
const responseHandler = require('../utils/responseHandler');
const messages = require('../utils/message');

class AuthController {
  async sendOtp(req, res) {
    try {
      const { phone } = req.body;
      const result = await authService.sendOtp(phone);
      return responseHandler.success(res, messages.AUTH.OTP_SENT, result);
    } catch (error) {
      return responseHandler.error(res, error.message || messages.COMMON.SOMETHING_WENT_WRONG);
    }
  }

  async verifyOtp(req, res) {
    try {
      const { phone, otp } = req.body;
      const result = await authService.verifyOtp(phone, otp);
      return responseHandler.success(res, messages.AUTH.OTP_VERIFIED, result);
    } catch (error) {
      return responseHandler.badRequest(res, error.message || messages.AUTH.LOGIN_FAILED);
    }
  }

  async adminLogin(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.adminLogin(email, password);
      return responseHandler.success(res, messages.AUTH.LOGIN_SUCCESS, result);
    } catch (error) {
      return responseHandler.unauthorized(res, error.message || messages.AUTH.LOGIN_FAILED);
    }
  }

  async logout(req, res) {
    return responseHandler.success(res, messages.AUTH.LOGIN_SUCCESS);
  }
}

module.exports = new AuthController();
