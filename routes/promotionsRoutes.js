const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotinsController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/', promotionController.getAllPromotions);
router.get('/:id', promotionController.getPromotionById);
router.post('/',  promotionController.createPromotion);
router.put('/:id',  promotionController.updatePromotionById);
router.delete('/:id',  promotionController.deletePromotionById);

module.exports = router;
