const express = require('express');
const favoriteController = require('../controllers/favoriteController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', favoriteController.getFavorites);
router.post('/', favoriteController.addToFavorites);
router.delete('/:id', favoriteController.removeFromFavorites);

module.exports = router;
