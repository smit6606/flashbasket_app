const productService = require('../services/productService');
const responseHandler = require('../utils/responseHandler');
const messages = require('../utils/message');

class ProductController {
  async getProducts(req, res) {
    try {
      const result = await productService.getProducts(req.query);
      return responseHandler.success(res, messages.PRODUCT.FETCH_SUCCESS, result);
    } catch (error) {
      return responseHandler.error(res, messages.PRODUCT.FETCH_FAILED, 500, error);
    }
  }

  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const result = await productService.getProductById(id);
      if (!result) {
        return responseHandler.notFound(res, messages.PRODUCT.NOT_FOUND);
      }
      return responseHandler.success(res, messages.PRODUCT.FETCH_SUCCESS, result);
    } catch (error) {
      return responseHandler.error(res, messages.PRODUCT.FETCH_FAILED, 500, error);
    }
  }

  async createProduct(req, res) {
    try {
      const result = await productService.createProduct(req.body);
      return responseHandler.success(res, messages.PRODUCT.CREATE_SUCCESS, result, 201);
    } catch (error) {
      return responseHandler.badRequest(res, error.message || messages.PRODUCT.FETCH_FAILED);
    }
  }

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const result = await productService.updateProduct(id, req.body);
      return responseHandler.success(res, messages.PRODUCT.UPDATE_SUCCESS, result);
    } catch (error) {
      return responseHandler.badRequest(res, error.message || messages.PRODUCT.FETCH_FAILED);
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const result = await productService.deleteProduct(id);
      return responseHandler.success(res, messages.PRODUCT.DELETE_SUCCESS, result);
    } catch (error) {
      return responseHandler.notFound(res, messages.PRODUCT.NOT_FOUND);
    }
  }
}

module.exports = new ProductController();
