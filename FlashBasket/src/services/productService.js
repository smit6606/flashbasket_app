import api from './api';

const productService = {
  /**
   * Fetch all products with optional filters (categoryId, query, etc.)
   */
  getAllProducts: async (params = {}) => {
    return api.get('/products', { params });
  },

  /**
   * Fetch a single product by ID
   */
  getProductById: async (id) => {
    return api.get(`/products/\${id}`);
  },

  /**
   * Fetch products by Category ID
   * Uses query parameters as per backend implementation
   */
  getProductsByCategory: async (categoryId) => {
    return api.get('/products', { params: { categoryId } });
  }
};

export default productService;
