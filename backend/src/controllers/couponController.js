const couponService = require('../services/couponService');
const responseHandler = require('../utils/responseHandler');
const messages = require('../utils/message');

class CouponController {
  async getCoupons(req, res) {
    try {
      const result = await couponService.getCoupons();
      return responseHandler.success(res, 'Coupons fetched', result);
    } catch (error) {
      return responseHandler.error(res, error.message || messages.COMMON.SOMETHING_WENT_WRONG);
    }
  }

  async validateCoupon(req, res) {
    try {
      const { code, subtotal } = req.body;
      const result = await couponService.validateCoupon(code, subtotal);
      return responseHandler.success(res, 'Coupon validated', result);
    } catch (error) {
      return responseHandler.badRequest(res, error.message || messages.COMMON.BAD_REQUEST);
    }
  }
}

module.exports = new CouponController();
