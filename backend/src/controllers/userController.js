const { User } = require('../models');
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
    try {
      const user = await User.findByPk(req.user.id);
      await user.update(req.body);
      return responseHandler.success(res, 'Profile updated', user);
    } catch (error) {
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
