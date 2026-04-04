const { Coupon } = require('../models');

class CouponService {
  async getCoupons() {
    const coupons = await Coupon.findAll({ where: { isActive: true } });
    return { success: true, data: coupons };
  }

  async validateCoupon(code, subtotal) {
    const coupon = await Coupon.findOne({ where: { code, isActive: true } });
    if (!coupon) throw new Error('Invalid coupon code');
    if (subtotal < coupon.minOrderAmount) throw new Error(`Min order amount ₹${coupon.minOrderAmount} required`);
    return { success: true, data: coupon };
  }

  async createCoupon(data) {
    const coupon = await Coupon.create(data);
    return { success: true, data: coupon };
  }
}

module.exports = new CouponService();
