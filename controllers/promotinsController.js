const Promotion = require('../models/PromotionModel');
const Product = require('../models/ProductModel');

// Fetch all promotions
exports.getAllPromotions = async (req, res) => {
    try {
        const promotions = await Promotion.find({}).populate('products');
        res.json(promotions);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching promotions', error: error.message });
    }
};

// Fetch a single promotion by ID
exports.getPromotionById = async (req, res) => {
    try {
        const promotion = await Promotion.findById(req.params.id).populate('products');
        if (!promotion) {
            return res.status(404).send({ message: 'Promotion not found' });
        }
        res.json(promotion);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching promotion', error: error.message });
    }
};

// Create a new promotion
exports.createPromotion = async (req, res) => {
    try {
        const { name, description, discountPercentage, startDate, endDate, products } = req.body;
        
        const newPromotion = new Promotion({
            name,
            description,
            discountPercentage,
            startDate,
            endDate,
            products
        });

        const promotion = await newPromotion.save();
        res.status(201).json(promotion);
    } catch (error) {
        res.status(500).send({ message: 'Error creating promotion', error: error.message });
    }
};

// Update a promotion by ID
exports.updatePromotionById = async (req, res) => {
    try {
        const promotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true, useFindAndModify: false });
        if (!promotion) {
            return res.status(404).send({ message: 'Promotion not found' });
        }
        res.json(promotion);
    } catch (error) {
        res.status(500).send({ message: 'Error updating promotion', error: error.message });
    }
};

// Delete a promotion by ID
exports.deletePromotionById = async (req, res) => {
    try {
        const promotion = await Promotion.findByIdAndDelete(req.params.id);
        if (!promotion) {
            return res.status(404).send({ message: 'Promotion not found' });
        }
        res.send({ message: 'Promotion deleted successfully', promotion });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting promotion', error: error.message });
    }
};

