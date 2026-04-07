const { Wallet, WalletTransaction, sequelize } = require('../models');

class WalletService {
  async getWallet(userId) {
    let wallet = await Wallet.findOne({ where: { userId } });
    if (!wallet) wallet = await Wallet.create({ userId, balance: 0 });
    return wallet;
  }

  async addMoney(userId, amount) {
    const t = await sequelize.transaction();
    try {
      let wallet = await Wallet.findOne({ where: { userId }, transaction: t });
      if (!wallet) wallet = await Wallet.create({ userId }, { transaction: t });
      
      const val = parseFloat(amount);
      wallet.balance += val;
      await wallet.save({ transaction: t });

      await WalletTransaction.create({
        userId,
        type: 'credit',
        amount: val,
        source: 'add_money',
        description: 'Money added to wallet'
      }, { transaction: t });

      await t.commit();
      return wallet;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async getHistory(userId) {
    const history = await WalletTransaction.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
    return history;
  }
}

module.exports = new WalletService();
