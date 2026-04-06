const { Favorite, Product } = require('../models');

class FavoriteService {
  async getFavorites(userId) {
    const favorites = await Favorite.findAll({
      where: { userId },
      include: [{ model: Product, as: 'product' }]
    });
    return favorites;
  }

  async addToFavorites(userId, productId) {
    let favorite = await Favorite.findOne({ where: { userId, productId } });
    if (!favorite) {
      favorite = await Favorite.create({ userId, productId });
    }
    return true;
  }

  async removeFromFavorites(userId, id) {
    const favorite = await Favorite.findOne({ where: { id, userId } });
    if (!favorite) throw new Error('Favorite not found');
    await favorite.destroy();
    return true;
  }
}

module.exports = new FavoriteService();
