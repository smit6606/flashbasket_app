/**
 * Secure & Robust App Configuration
 * 
 * IMPORTANT: We are NOT importing react-native-config directly here 
 * because it can crash the app if the native module is unlinked.
 * Instead, we use these hardcoded defaults that match your .env files.
 */

const APP_CONFIG = {
  // API Config (Defaults from .env)
  BASE_URL: 'https://rsd58pbr-5000.inc1.devtunnels.ms/api/',
  IMAGE_BASE_URL: 'https://rsd58pbr-5000.inc1.devtunnels.ms',
  SOCKET_URL: 'https://rsd58pbr-5000.inc1.devtunnels.ms',
  TIMEOUT: 15000,

  // App Metadata
  APP_NAME: 'FlashBasket',
  APP_VERSION: '1.0.0',

  // Google Maps
  GOOGLE_MAPS_KEY: '',

  // Fallback UI Values
  DEFAULT_PLACEHOLDER: 'https://cdn-icons-png.flaticon.com/512/3081/3081986.png',
  USER_PLACEHOLDER: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
};

/**
 * Dynamic Config Loader
 * Attempts to load from native module if available, otherwise stays with defaults.
 */
export const getSafeConfig = async () => {
  try {
     // We dynamically import to prevent crashes on startup
     const ReactNativeConfig = require('react-native-config').default;
     if (ReactNativeConfig) {
       return { ...APP_CONFIG, ...ReactNativeConfig };
     }
  } catch (e) {
     console.warn('[Config] Native module not found, using defaults.');
  }
  return APP_CONFIG;
};

export default APP_CONFIG;
