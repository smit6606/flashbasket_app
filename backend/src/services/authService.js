const jwt = require('jsonwebtoken');
const { User, Wallet, Cart } = require('../models');

class AuthService {
  async sendOtp(phone) {
    // Generate simple 6-digit OTP for development
    const otp = '123456';
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    let user = await User.findOne({ where: { phone } });
    if (!user) {
      user = await User.create({ phone, otp, otpExpiry });
      // Create wallet and cart for new user
      await Wallet.create({ userId: user.id });
      await Cart.create({ userId: user.id });
    } else {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    }

    return { success: true, message: 'OTP sent successfully' };
  }

  async verifyOtp(phone, otp) {
    const user = await User.findOne({ where: { phone } });
    
    if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
      throw new Error('Invalid or expired OTP');
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '1d' }
    );

    // Clear OTP
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return { success: true, token, user: { id: user.id, phone: user.phone, name: user.name, role: user.role } };
  }

  async adminLogin(email, password) {
    const user = await User.findOne({ where: { email, role: 'admin' } });
    
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '1d' }
    );

    return { success: true, token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  }
}

module.exports = new AuthService();
