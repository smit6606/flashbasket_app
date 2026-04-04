const express = require('express');
const couponController = require('../controllers/couponController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', couponController.getCoupons);
router.post('/apply', couponController.validateCoupon);

module.exports = router;
