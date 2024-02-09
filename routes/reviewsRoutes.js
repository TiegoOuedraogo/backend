const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewsController'); 
const { protect, admin } = require('..//middlewares/authMiddleware'); 

router.get('/product/:productId', reviewController.getProductReviews);
router.post('/',reviewController.createReview);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
