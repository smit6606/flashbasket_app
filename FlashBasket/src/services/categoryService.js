import api from './api';

const categoryService = {
  /**
   * Fetch all categories from the admin panel
   */
  getAllCategories: async () => {
    return api.get('/categories');
  },

  /**
   * Fetch subcategories for a specific category
   */
  getSubcategories: async (categoryId) => {
    return api.get(`/categories/subcategories/${categoryId}`);
  },
};

export default categoryService;
