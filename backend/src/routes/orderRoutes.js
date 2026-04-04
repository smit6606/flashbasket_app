const express = require('express');
const orderController = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/create', orderController.createOrder);
router.get('/history', orderController.getOrderHistory);
router.get('/:id', orderController.getOrderById);

// Admin APIs
router.get('/admin/orders', adminMiddleware, orderController.getAllOrders);
router.put('/admin/status/:id', adminMiddleware, orderController.updateStatus);

module.exports = router;
