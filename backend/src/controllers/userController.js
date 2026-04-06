const { User, Wallet, WalletTransaction, sequelize } = require('../models');
const responseHandler = require('../utils/responseHandler');
const messages = require('../utils/message');

class UserController {
  async getProfile(req, res) {
    try {
      let user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['otp', 'otpExpiry'] }
      });
      if (user && !user.referralCode) {
        let code = '';
        let isUnique = false;
        while (!isUnique) {
          code = 'FLASH' + Math.floor(1000 + Math.random() * 9000);
          const exists = await User.findOne({ where: { referralCode: code } });
          if (!exists) isUnique = true;
        }
        user.referralCode = code;
        await user.save();
      }
      return responseHandler.success(res, 'Profile fetched', user);
    } catch (error) {
      return responseHandler.error(res, error.message || messages.COMMON.SOMETHING_WENT_WRONG);
    }
  }

  async updateProfile(req, res) {
    const t = await sequelize.transaction();
    try {
      const user = await User.findByPk(req.user.id, { transaction: t });
      
      const wasNotReferred = !user.referredBy;
      const newReferralCode = req.body.referredBy;

      await user.update(req.body, { transaction: t });

      if (wasNotReferred && newReferralCode) {
        // Immediate Referral Payout
        const referrer = await User.findOne({ where: { referralCode: newReferralCode }, transaction: t });
        if (referrer && referrer.id !== user.id) {
          // Pay the referrer
          let referrerWallet = await Wallet.findOne({ where: { userId: referrer.id }, transaction: t });
          if (!referrerWallet) referrerWallet = await Wallet.create({ userId: referrer.id, balance: 0 }, { transaction: t });
          
          referrerWallet.balance += 50;
          await referrerWallet.save({ transaction: t });
          await WalletTransaction.create({
            userId: referrer.id, type: 'credit', amount: 50, source: 'referral', description: `Referral bonus (via ${user.name || 'New User'})`
          }, { transaction: t });

          // Pay the new user
          let userWallet = await Wallet.findOne({ where: { userId: user.id }, transaction: t });
          if (!userWallet) userWallet = await Wallet.create({ userId: user.id, balance: 0 }, { transaction: t });

          userWallet.balance += 50;
          await userWallet.save({ transaction: t });
          await WalletTransaction.create({
            userId: user.id, type: 'credit', amount: 50, source: 'referral', description: `Referred by ${referrer.name || 'Friend'}`
          }, { transaction: t });
        }
      }

      await t.commit();
      return responseHandler.success(res, 'Profile updated', user);
    } catch (error) {
      await t.rollback();
      return responseHandler.badRequest(res, error.message || messages.COMMON.BAD_REQUEST);
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['otp', 'otpExpiry'] }
      });
      return responseHandler.success(res, 'Users fetched', users);
    } catch (error) {
      return responseHandler.error(res, error.message || messages.COMMON.SOMETHING_WENT_WRONG);
    }
  }
}

module.exports = new UserController();
