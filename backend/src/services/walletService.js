const { Wallet } = require('../models');

class WalletService {
  async getWallet(userId) {
    let wallet = await Wallet.findOne({ where: { userId } });
    if (!wallet) wallet = await Wallet.create({ userId });
    return { success: true, data: wallet };
  }

  async addMoney(userId, amount) {
    let wallet = await Wallet.findOne({ where: { userId } });
    if (!wallet) wallet = await Wallet.create({ userId });
    wallet.balance += parseFloat(amount);
    await wallet.save();
    return { success: true, data: wallet };
  }
}

module.exports = new WalletService();
