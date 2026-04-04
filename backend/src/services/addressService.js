const { Address } = require('../models');

class AddressService {
  async getAddresses(userId) {
    const addresses = await Address.findAll({ where: { userId } });
    return { success: true, data: addresses };
  }

  async createAddress(userId, data) {
    const address = await Address.create({ ...data, userId });
    return { success: true, data: address };
  }

  async updateAddress(userId, id, data) {
    const address = await Address.findOne({ where: { id, userId } });
    if (!address) throw new Error('Address not found');
    await address.update(data);
    return { success: true, data: address };
  }

  async deleteAddress(userId, id) {
    const address = await Address.findOne({ where: { id, userId } });
    if (!address) throw new Error('Address not found');
    await address.destroy();
    return { success: true, message: 'Address deleted' };
  }
}

module.exports = new AddressService();
