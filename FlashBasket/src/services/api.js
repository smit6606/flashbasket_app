import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APP_CONFIG from '../config';

/**
 * Standardized API client for FlashBasket
 * Uses centralized APP_CONFIG to handle environment variables safely.
 */

const api = axios.create({
  baseURL: APP_CONFIG.BASE_URL,
  timeout: APP_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Tunnel-Skip-Anti-Phishing-Page': 'true', // Required to bypass Dev Tunnel splash page
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  async (config) => {
    // Robust baseURL handling: 
    // If baseURL is set and url starts with '/', axios drops the baseURL prefix.
    // We strip the leading slash to ensure they combine correctly.
    if (config.url && config.url.startsWith('/') && config.baseURL) {
      config.url = config.url.substring(1);
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('[API Request Error] Error fetching token:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Standardize format and handle session expiration
api.interceptors.response.use(
  (response) => {
    // Return standardized data if success property exists
    if (response.data && response.data.success !== undefined) {
      return response.data;
    }
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response) {
      const { status, data } = error.response;
      
      // Handle Unauthorized (401)
      if (status === 401 && !originalRequest._retry) {
        console.warn('[API Auth Error] Unauthorized. Clearing local session.');
        await AsyncStorage.multiRemove(['token', 'user']);
      }
      
      // Extract standardized error message
      const errorMessage = data?.message || error.message || 'Something went wrong';
      return Promise.reject({ 
        status, 
        message: errorMessage, 
        data: data?.data || null,
        success: false
      });
    }

    if (error.request) {
      return Promise.reject({ 
        status: 0, 
        message: 'Network connection failed. Please check your internet.', 
        data: null,
        success: false
      });
    }

    return Promise.reject({ 
      status: -1, 
      message: error.message, 
      data: null,
      success: false
    });
  }
);

export default api;
