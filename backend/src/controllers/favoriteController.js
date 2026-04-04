const favoriteService = require('../services/favoriteService');
const responseHandler = require('../utils/responseHandler');
const messages = require('../utils/message');

class FavoriteController {
  async getFavorites(req, res) {
    try {
      const result = await favoriteService.getFavorites(req.user.id);
      return responseHandler.success(res, 'Favorites fetched', result);
    } catch (error) {
      return responseHandler.error(res, error.message || messages.COMMON.SOMETHING_WENT_WRONG);
    }
  }

  async addToFavorites(req, res) {
    try {
      const { productId } = req.body;
      const result = await favoriteService.addToFavorites(req.user.id, productId);
      return responseHandler.success(res, 'Added to favorites', result);
    } catch (error) {
      return responseHandler.badRequest(res, error.message || messages.COMMON.BAD_REQUEST);
    }
  }

  async removeFromFavorites(req, res) {
    try {
      const { id } = req.params;
      const result = await favoriteService.removeFromFavorites(req.user.id, id);
      return responseHandler.success(res, 'Removed from favorites', result);
    } catch (error) {
      return responseHandler.notFound(res, error.message || messages.COMMON.NOT_FOUND);
    }
  }
}

module.exports = new FavoriteController();
