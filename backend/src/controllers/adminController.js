const adminService = require('../services/adminService');
const productService = require('../services/productService');
const categoryService = require('../services/categoryService');
const orderService = require('../services/orderService');
const userService = require('../services/userService');
const subcategoryService = require('../services/subcategoryService');
const responseHandler = require('../utils/responseHandler');
const messages = require('../utils/message');

class AdminController {
  async getDashboardStats(req, res) {
    try {
      const stats = await adminService.getDashboardStats();
      return responseHandler.success(res, 'Dashboard stats fetched', stats);
    } catch (error) {
      return responseHandler.error(res, error.message || messages.COMMON.SOMETHING_WENT_WRONG);
    }
  }

  async getRecentOrders(req, res) {
    try {
      const recentOrders = await adminService.getRecentOrders();
      return responseHandler.success(res, 'Recent orders fetched', recentOrders);
    } catch (error) {
      return responseHandler.error(res, error.message || messages.COMMON.SOMETHING_WENT_WRONG);
    }
  }

  async getSalesChartData(req, res) {
    try {
      const chartData = await adminService.getSalesChartData();
      return responseHandler.success(res, 'Sales chart data fetched', chartData);
    } catch (error) {
      return responseHandler.error(res, error.message || messages.COMMON.SOMETHING_WENT_WRONG);
    }
  }

  // Consolidated Product Management
  async getAllProducts(req, res) {
    try {
      const products = await productService.getProducts();
      return responseHandler.success(res, messages.PRODUCT.FETCH_SUCCESS, products);
    } catch (error) {
      return responseHandler.error(res, error.message || messages.PRODUCT.FETCH_FAILED);
    }
  }

  async createProduct(req, res) {
    try {
      const result = await productService.createProduct(req.body);
      return responseHandler.success(res, messages.PRODUCT.CREATE_SUCCESS, result, 201);
    } catch (error) {
      return responseHandler.badRequest(res, error.message || messages.COMMON.BAD_REQUEST);
    }
  }

  async updateProduct(req, res) {
    try {
      const result = await productService.updateProduct(req.params.id, req.body);
      return responseHandler.success(res, messages.PRODUCT.UPDATE_SUCCESS, result);
    } catch (error) {
      return responseHandler.badRequest(res, error.message || messages.COMMON.BAD_REQUEST);
    }
  }

  async deleteProduct(req, res) {
    try {
      const result = await productService.deleteProduct(req.params.id);
      return responseHandler.success(res, messages.PRODUCT.DELETE_SUCCESS, result);
    } catch (error) {
      return responseHandler.badRequest(res, error.message || messages.COMMON.BAD_REQUEST);
    }
  }

  // Consolidated Category Management
  async getAllCategories(req, res) {
    try {
      const categories = await categoryService.getCategories();
      return responseHandler.success(res, 'Categories fetched', categories);
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

  // Consolidated Subcategory Management
  async getAllSubcategories(req, res) {
    try {
      const subcategories = await subcategoryService.getSubcategories();
      return responseHandler.success(res, 'Subcategories fetched', subcategories);
    } catch (error) {
      return responseHandler.error(res, error.message || messages.COMMON.SOMETHING_WENT_WRONG);
    }
  }

  async createSubcategory(req, res) {
    try {
      const result = await subcategoryService.createSubcategory(req.body);
      return responseHandler.success(res, 'Subcategory created', result, 201);
    } catch (error) {
      return responseHandler.badRequest(res, error.message || messages.COMMON.BAD_REQUEST);
    }
  }

  async updateSubcategory(req, res) {
    try {
      const result = await subcategoryService.updateSubcategory(req.params.id, req.body);
      return responseHandler.success(res, 'Subcategory updated', result);
    } catch (error) {
      return responseHandler.badRequest(res, error.message || messages.COMMON.BAD_REQUEST);
    }
  }

  async deleteSubcategory(req, res) {
    try {
      const result = await subcategoryService.deleteSubcategory(req.params.id);
      return responseHandler.success(res, 'Subcategory deleted', result);
    } catch (error) {
      return responseHandler.badRequest(res, error.message || messages.COMMON.BAD_REQUEST);
    }
  }

  // Order Management
  async getAllOrders(req, res) {
    try {
      const orders = await orderService.getAllOrders();
      return responseHandler.success(res, messages.ORDER.FETCH_SUCCESS, orders);
    } catch (error) {
      return responseHandler.error(res, error.message || messages.COMMON.SOMETHING_WENT_WRONG);
    }
  }

  async getOrderById(req, res) {
    try {
      const result = await orderService.getOrderById(null, req.params.id, true); // true for admin mode
      if (!result) {
        return responseHandler.notFound(res, messages.ORDER.NOT_FOUND);
      }
      return responseHandler.success(res, messages.ORDER.FETCH_SUCCESS, result);
    } catch (error) {
      return responseHandler.error(res, error.message || messages.COMMON.SOMETHING_WENT_WRONG);
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const result = await orderService.updateOrderStatus(req.params.id, req.body.status);
      return responseHandler.success(res, messages.ORDER.UPDATE_SUCCESS, result);
    } catch (error) {
      return responseHandler.badRequest(res, error.message || messages.COMMON.BAD_REQUEST);
    }
  }

  // User Management
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      return responseHandler.success(res, 'Users fetched', users);
    } catch (error) {
      return responseHandler.error(res, error.message || messages.COMMON.SOMETHING_WENT_WRONG);
    }
  }
}

module.exports = new AdminController();
