const { User, Order, Wallet } = require('../models');

class UserService {
  async getAllUsers() {
    const users = await User.findAll({
      where: { role: 'user' },
      attributes: { exclude: ['password', 'otp', 'otpExpiry'] },
      include: [
        { model: Wallet, as: 'wallet' },
        { model: Order, as: 'orders' }
      ]
    });
    return users;
  }
}

module.exports = new UserService();
