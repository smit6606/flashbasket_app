import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const userService = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    if (response.data) {
       await AsyncStorage.setItem('user', JSON.stringify(response.data));
    }
    return response;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/user/update', profileData);
    if (response.data) {
      await AsyncStorage.setItem('user', JSON.stringify(response.data));
    }
    return response;
  },

  getAddresses: async () => {
    return api.get('/address');
  },

  addAddress: async (addressData) => {
    return api.post('/address', addressData);
  },

  updateAddress: async (id, addressData) => {
    return api.put(`/address/${id}`, addressData);
  },

  deleteAddress: async (id) => {
    return api.delete(`/address/${id}`);
  },

  setDefaultAddress: async (id) => {
    return api.put(`/address/${id}/default`);
  },

  getWalletInfo: async () => {
    return api.get('/wallet');
  },

  addMoneyToWallet: async (amount) => {
    return api.post('/wallet/add', { amount });
  },

  getWalletTransactions: async () => {
    return api.get('/wallet/history');
  }
};

export default userService;
