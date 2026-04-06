const { Address } = require('../models');

class AddressService {
  async getAddresses(userId) {
    const addresses = await Address.findAll({ where: { userId } });
    return addresses;
  }

  async createAddress(userId, data) {
    // If this is the first address or explicitly set as default, handle correctly
    const existingAddresses = await Address.count({ where: { userId } });
    const isDefault = existingAddresses === 0 || data.isDefault;

    if (isDefault) {
      await Address.update({ isDefault: false }, { where: { userId } });
    }

    const address = await Address.create({ ...data, userId, isDefault });
    return address;
  }

  async updateAddress(userId, id, data) {
    const address = await Address.findOne({ where: { id, userId } });
    if (!address) throw new Error('Address not found');

    if (data.isDefault) {
      await Address.update({ isDefault: false }, { where: { userId } });
    }

    await address.update(data);
    return address;
  }

  async setDefaultAddress(userId, id) {
    // 1. Force all addresses for this user to be non-default
    await Address.update({ isDefault: false }, { where: { userId } });
    
    // 2. Set the specific address as default
    const [updatedCount] = await Address.update(
      { isDefault: true },
      { where: { id, userId } }
    );
    
    if (updatedCount === 0) {
      throw new Error('Address not found or unauthorized');
    }
    
    // 3. Return the updated address instance
    return await Address.findOne({ where: { id, userId } });
  }

  async deleteAddress(userId, id) {
    const address = await Address.findOne({ where: { id, userId } });
    if (!address) throw new Error('Address not found');
    
    const wasDefault = address.isDefault;
    await address.destroy();

    // If we deleted the default address, set another one as default
    if (wasDefault) {
      const nextAddress = await Address.findOne({ where: { userId } });
      if (nextAddress) {
        await nextAddress.update({ isDefault: true });
      }
    }
    
    return { success: true, message: 'Address deleted' };
  }
}

module.exports = new AddressService();
