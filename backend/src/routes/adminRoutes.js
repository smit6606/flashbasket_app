const express = require('express');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Public Admin Routes
router.post('/login', authController.adminLogin);
router.post('/auth/send-otp', authController.sendOtp);
router.post('/auth/verify-otp', authController.verifyOtp);

// Protected Admin Routes
router.use(authMiddleware, adminMiddleware);

// Dashboard Stats
router.get('/stats', adminController.getDashboardStats);
router.get('/recent-orders', adminController.getRecentOrders);
router.get('/chart-data', adminController.getSalesChartData);

// Product Management
router.get('/products', adminController.getAllProducts);
router.post('/product', adminController.createProduct);
router.put('/product/:id', adminController.updateProduct);
router.delete('/product/:id', adminController.deleteProduct);

// Category Management
router.get('/categories', adminController.getAllCategories);
router.post('/category', adminController.createCategory);
// Note: PUT/DELETE for category can be added if needed, sticking to prompt's focus

// Subcategory Management
router.get('/subcategories', adminController.getAllSubcategories);
router.post('/subcategory', adminController.createSubcategory);
router.put('/subcategory/:id', adminController.updateSubcategory);
router.delete('/subcategory/:id', adminController.deleteSubcategory);

// Order Management
router.get('/orders', adminController.getAllOrders);
router.get('/order/:id', adminController.getOrderById);
router.put('/order/status/:id', adminController.updateOrderStatus);

// User Management
router.get('/users', adminController.getAllUsers);

module.exports = router;
