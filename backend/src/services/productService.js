const { Product, Category, Sequelize } = require('../models');
const { Op } = Sequelize;

class ProductService {
  async getProducts({ categoryId, minPrice, maxPrice, rating, discount, query, page = 1, limit = 10, sort = 'createdAt', order = 'DESC' }) {
    const where = {};
    if (categoryId) where.categoryId = categoryId;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }
    if (rating) where.rating[Op.gte] = rating;
    if (discount) where.discount[Op.gte] = discount;
    if (query) {
      where.name = { [Op.like]: `%${query}%` };
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [{ model: Category, as: 'category' }],
      offset: (page - 1) * limit,
      limit: parseInt(limit),
      order: [[sort, order]]
    });

    return {
      data: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    };
  }

  async getProductById(id) {
    const product = await Product.findByPk(id, {
      include: [{ model: Category, as: 'category' }]
    });
    if (!product) throw new Error('Product not found');
    return product;
  }

  async createProduct(data) {
    const product = await Product.create(data);
    return product;
  }

  async updateProduct(id, data) {
    const product = await Product.findByPk(id);
    if (!product) throw new Error('Product not found');
    await product.update(data);
    return product;
  }

  async deleteProduct(id) {
    const product = await Product.findByPk(id);
    if (!product) throw new Error('Product not found');
    await product.destroy();
    return { message: 'Product deleted successfully' };
  }
}

module.exports = new ProductService();
