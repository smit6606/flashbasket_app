const { Category, Product } = require('../models');

class CategoryService {
  async getCategories() {
    const categories = await Category.findAll();
    return categories;
  }

  async getCategoryById(id) {
    const category = await Category.findByPk(id, {
      include: [{ model: Product, as: 'products' }]
    });
    if (!category) throw new Error('Category not found');
    return category;
  }

  async createCategory(data) {
    const category = await Category.create(data);
    return category;
  }
}

module.exports = new CategoryService();
