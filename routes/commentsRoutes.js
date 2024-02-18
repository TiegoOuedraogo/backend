// routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentsController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/review/:reviewId', commentController.getCommentsForReview);
router.get('/:id', commentController.getCommentById);
router.post('/',  commentController.createComment);
router.put('/:id',  commentController.updateCommentById);
router.delete('/:id', commentController.deleteCommentById);

module.exports = router;
