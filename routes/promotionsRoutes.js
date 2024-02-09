const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotinsController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Fetch all promotions
router.get('/', promotionController.getAllPromotions);

// Fetch a single promotion by ID
router.get('/:id', promotionController.getPromotionById);

// Create a new promotion
router.post('/',  promotionController.createPromotion);

// Update a promotion by ID
router.put('/:id',  promotionController.updatePromotionById);

// Delete a promotion by ID
router.delete('/:id',  promotionController.deletePromotionById);

module.exports = router;
