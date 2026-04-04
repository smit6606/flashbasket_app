const categoryService = require('../services/categoryService');
const responseHandler = require('../utils/responseHandler');
const messages = require('../utils/message');

class CategoryController {
  async getCategories(req, res) {
    try {
      const result = await categoryService.getCategories();
      return responseHandler.success(res, 'Categories fetched', result);
    } catch (error) {
      return responseHandler.error(res, error.message || messages.COMMON.SOMETHING_WENT_WRONG);
    }
  }

  async getCategoryById(req, res) {
    try {
      const { id } = req.params;
      const result = await categoryService.getCategoryById(id);
      if (!result) {
        return responseHandler.notFound(res, messages.COMMON.NOT_FOUND);
      }
      return responseHandler.success(res, 'Category fetched', result);
    } catch (error) {
      return responseHandler.error(res, error.message || messages.COMMON.SOMETHING_WENT_WRONG);
    }
  }

  async createCategory(req, res) {
    try {
      const result = await categoryService.createCategory(req.body);
      return responseHandler.success(res, 'Category created', result, 201);
    } catch (error) {
      return responseHandler.badRequest(res, error.message || messages.COMMON.BAD_REQUEST);
    }
  }
}

module.exports = new CategoryController();
