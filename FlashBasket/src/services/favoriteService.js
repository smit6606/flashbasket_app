import api from './api';

const favoriteService = {
  getFavorites: async () => {
    try {
      const response = await api.get('/favorites');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  addToFavorites: async (productId) => {
    try {
      const response = await api.post('/favorites', { productId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  removeFromFavorites: async (favoriteId) => {
    try {
      const response = await api.delete(`/favorites/${favoriteId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default favoriteService;
