const express = require('express');
const categoryController = require('../controllers/categoryController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);

// Admin API for category
router.post('/admin', authMiddleware, adminMiddleware, categoryController.createCategory);

module.exports = router;
