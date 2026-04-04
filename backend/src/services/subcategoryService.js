const { Subcategory, Category } = require('../models');

class SubcategoryService {
  async getSubcategories() {
    const subcategories = await Subcategory.findAll({
      include: [{ model: Category, as: 'category' }]
    });
    return subcategories;
  }

  async createSubcategory(data) {
    const subcategory = await Subcategory.create(data);
    return subcategory;
  }

  async updateSubcategory(id, data) {
    const subcategory = await Subcategory.findByPk(id);
    if (!subcategory) throw new Error('Subcategory not found');
    await subcategory.update(data);
    return subcategory;
  }

  async deleteSubcategory(id) {
    const subcategory = await Subcategory.findByPk(id);
    if (!subcategory) throw new Error('Subcategory not found');
    await subcategory.destroy();
    return { message: 'Subcategory deleted successfully' };
  }
}

module.exports = new SubcategoryService();
