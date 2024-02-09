const express = require('express');
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/items', authMiddleware, cartController.getUserCartItems);
router.post('/addToCart', authMiddleware, cartController.addToCart);
router.put('/update', authMiddleware, cartController.updateItemQuantity);
router.delete('/remove/:productId', authMiddleware, cartController.removeItem);
router.get('/clear', authMiddleware, cartController.clearCart);

module.exports = router;

