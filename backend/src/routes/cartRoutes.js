const express = require('express');
const cartController = require('../controllers/cartController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/update/:id', cartController.updateCartItem);
router.delete('/remove/:id', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);

module.exports = router;
