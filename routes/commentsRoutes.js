// routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentsController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Fetch all comments for a review
router.get('/review/:reviewId', commentController.getCommentsForReview);

// Fetch a single comment by ID
router.get('/:id', commentController.getCommentById);

// Create a new comment
router.post('/',  commentController.createComment);

// Update a comment by ID
router.put('/:id',  commentController.updateCommentById);

// Delete a comment by ID
router.delete('/:id', commentController.deleteCommentById);

module.exports = router;
