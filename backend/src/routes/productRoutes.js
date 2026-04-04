const express = require('express');
const productController = require('../controllers/productController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Admin APIs for products
router.post('/admin', authMiddleware, adminMiddleware, productController.createProduct);
router.put('/admin/:id', authMiddleware, adminMiddleware, productController.updateProduct);
router.delete('/admin/:id', authMiddleware, adminMiddleware, productController.deleteProduct);

module.exports = router;
