const express = require('express');
const addressController = require('../controllers/addressController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', addressController.getAddresses);
router.post('/', addressController.createAddress);
router.put('/:id', addressController.updateAddress);
router.delete('/:id', addressController.deleteAddress);
router.put('/:id/default', addressController.setDefaultAddress);

module.exports = router;
