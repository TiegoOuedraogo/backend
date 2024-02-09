const Comment = require('../models/CommentModel');
const Review = require('../models/ReviewModel');

// Create a new comment
exports.createComment = async (req, res) => {
    const { reviewId, text } = req.body; 
    const userId = req.user.id; 

    try {
        // Create a new comment
        const newComment = new Comment({
            review: reviewId,
            user: userId,
            text: text,
            createdAt: new Date()
        });

        // Save the new comment
        const comment = await newComment.save();
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).send({ message: 'Error creating comment', error: error.message });
    }
};


// Fetch all comments for a review
exports.getCommentsForReview = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const comments = await Comment.find({ review: reviewId }).populate('user', 'username');
        res.json(comments);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching comments', error: error.message });
    }
};

// Fetch a single comment by ID
exports.getCommentById = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id).populate('user', 'username');
        if (!comment) {
            return res.status(404).send({ message: 'Comment not found' });
        }
        res.json(comment);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching comment', error: error.message });
    }
};

// Update a comment by ID
exports.updateCommentById = async (req, res) => {
    const commentId = req.params.id; 
    const userId = req.user.id; 
    const { text } = req.body;

    try {
        // Fetch the comment by ID
        const comment = await Comment.findById(commentId);

        // Check if comment exists and if the user making the request is the one who created the comment
        if (!comment) {
            return res.status(404).send({ message: 'Comment not found' });
        }
        if (comment.user.toString() !== userId) {
            return res.status(401).send({ message: 'User not authorized to update this comment' });
        }

        // Update the comment's text
        comment.text = text;

        // Save the updated comment
        const updatedComment = await comment.save();
        res.json(updatedComment);
    } catch (error) {
        res.status(500).send({ message: 'Error updating comment', error: error.message });
    }
};

// Delete a comment by ID
exports.deleteCommentById = async (req, res) => {
    const commentId = req.params.id; 
    const userId = req.user.id; 

    try {
        // Fetch the comment by ID
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).send({ message: 'Comment not found' });
        }
        if (comment.user.toString() !== userId && req.user.role !== 'admin') {
            return res.status(401).send({ message: 'User not authorized to delete this comment' });
        }

        // Delete the comment
        await comment.remove();
        res.send({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting comment', error: error.message });
    }
};

