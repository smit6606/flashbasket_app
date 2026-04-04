const express = require('express');
const walletController = require('../controllers/walletController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', walletController.getWallet);
router.post('/add', walletController.addMoney);

module.exports = router;
