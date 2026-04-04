import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Auth Service to handle authentication logic.
 * Standardized to work with the centralized API client.
 */
const authService = {
  sendOtp: async (phone) => {
    return api.post('/auth/send-otp', { phone });
  },

  verifyOtp: async (phone, otp) => {
    const response = await api.post('/auth/verify-otp', { phone, otp });
    
    // Extract the inner 'data' payload which contains { token, user }
    const authData = response.data || {};
    
    if (authData.token) {
      await AsyncStorage.setItem('token', authData.token);
      if (authData.user) {
        await AsyncStorage.setItem('user', JSON.stringify(authData.user));
      }
    }
    
    return authData;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      await AsyncStorage.multiRemove(['token', 'user']);
    }
  },

  getCurrentUser: async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  }
};

export default authService;
