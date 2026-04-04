const express = require('express');
const userController = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', authMiddleware, userController.getProfile);
router.put('/update', authMiddleware, userController.updateProfile);

// Admin API
router.get('/admin/users', authMiddleware, adminMiddleware, userController.getAllUsers);

module.exports = router;
