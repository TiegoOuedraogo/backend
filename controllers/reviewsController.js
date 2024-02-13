const Product = require('../models/ProductModel');
const Review = require('../models/ReviewModel');

// Helper function to add a review to a product
const addReviewToProduct = async (productId, reviewId) => {
    try {
        await Product.findByIdAndUpdate(
            productId,
            { $push: { reviews: reviewId } },
            { new: true, useFindAndModify: false }
        );
    } catch (error) {
        console.error('Error adding review to product:', error);
        throw new Error('Error adding review to product');
    }
};

exports.createReview = async (req, res) => {
    const { productId, rating, text } = req.body;
    const userId = req.user.id;

    try {
        const productExists = await Product.exists({ _id: productId });
        if (!productExists) {
            return res.status(404).send({ message: 'Product not found' });
        }

        const review = new Review({ product: productId, user: userId, rating, text });
        const savedReview = await review.save();

        await addReviewToProduct(productId, savedReview._id);

        res.status(201).json(savedReview);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).send({ message: 'Error creating review', error: error.message });
    }
};

exports.getProductReviews = async (req, res) => {
    const { productId } = req.params;

    try {
        const reviews = await Review.find({ product: productId }).populate('user', 'username');
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching product reviews:', error);
        res.status(500).send({ message: 'Error fetching product reviews', error: error.message });
    }
};

exports.updateReview = async (req, res) => {
    const { rating, text } = req.body;
    const { id: reviewId } = req.params;
    const userId = req.user.id;

    try {
        const review = await Review.findOne({ _id: reviewId, user: userId });
        if (!review) {
            return res.status(404).send({ message: 'Review not found or user not authorized' });
        }

        review.rating = rating;
        review.text = text;
        const updatedReview = await review.save();

        res.status(200).json(updatedReview);
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).send({ message: 'Error updating review', error: error.message });
    }
};

exports.deleteReview = async (req, res) => {
    const { id: reviewId } = req.params;
    const userId = req.user.id;

    try {
        const review = await Review.findById(reviewId);
        if (!review || (review.user.toString() !== userId && req.user.role !== 'admin')) {
            return res.status(404).send({ message: 'Review not found or user not authorized' });
        }

        await review.remove();
        res.status(200).send({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).send({ message: 'Error deleting review', error: error.message });
    }
};
