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
        throw error;
    }
};

exports.createReview = async (req, res) => {
    const { productId, rating, text } = req.body;
    const userId = req.user.id;

    try {
        // Create a new review
        const newReview = new Review({
            product: productId,
            user: userId,
            rating: rating,
            text: text,
        });

        // Save the new review
        const review = await newReview.save();

        // Add the review to the product
        await addReviewToProduct(productId, review._id);

        res.status(201).json(review);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).send({ message: 'Error creating review', error: error.message });
    }
};

exports.getProductReviews = async (req, res) => {
    try {
        const productId = req.params.productId; 

        // Find reviews for the given product ID
        const reviews = await Review.find({ product: productId }).populate('user', 'username');

        if (!reviews) {
            return res.status(404).send({ message: 'Reviews not found for this product.' });
        }

        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching product reviews:', error);
        res.status(500).send({ message: 'Error fetching product reviews', error: error.message });
    }
};

exports.createReview = async (req, res) => {
    try {
        const { productId, rating, text } = req.body; 
        const userId = req.user.id; 

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }

        // Create a new review
        const review = new Review({
            product: productId,
            user: userId,
            rating: rating,
            text: text
        });

        // Save the new review
        await review.save();

        await Product.findByIdAndUpdate(
            productId,
            { $push: { reviews: review._id } },
            { new: true, useFindAndModify: false }
        );

        res.status(201).json(review);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).send({ message: 'Error creating review', error: error.message });
    }
};

exports.updateReview = async (req, res) => {
    const reviewId = req.params.id; 
    const userId = req.user.id; 
    const { rating, text } = req.body; 

    try {
        // Fetch the review by ID
        const review = await Review.findById(reviewId);

        // Check if review exists
        if (!review) {
            return res.status(404).send({ message: 'Review not found' });
        }

        // Check if the user making the request is the one who created the review
        if (review.user.toString() !== userId) {
            return res.status(401).send({ message: 'User not authorized to update this review' });
        }

        // Update the review
        review.rating = rating;
        review.text = text;

        // Save the updated review
        const updatedReview = await review.save();

        res.status(200).json(updatedReview);
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).send({ message: 'Error updating review', error: error.message });
    }
};

exports.deleteReview = async (req, res) => {
    const reviewId = req.params.id; 
    const userId = req.user.id; 

    try {
        // Fetch the review by ID
        const review = await Review.findById(reviewId);

        // Check if review exists
        if (!review) {
            return res.status(404).send({ message: 'Review not found' });
        }

        // Check if the user making the request is the one who created the review
        if (review.user.toString() !== userId && req.user.role !== 'admin') {
            return res.status(401).send({ message: 'User not authorized to delete this review' });
        }

        // Delete the review
        await review.remove();

        res.status(200).send({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).send({ message: 'Error deleting review', error: error.message });
    }
};
