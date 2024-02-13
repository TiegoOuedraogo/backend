const Category = require('../models/CategoryModel');
const Product = require('../models/ProductModel');

// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const { name, description, products } = req.body;
        
        const newCategory = new Category({
            name,
            description,
            products
        });

        const category = await newCategory.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(500).send({ message: 'Error creating category', error: error.message });
    }
};
// Fetch all categories
exports.getAllCategories = async (req, res) => {
    console.log('getAllCategories called');
    try {
        const categories = await Category.find({}).populate('products');
        res.json(categories);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching categories', error: error.message });
    }
};

// Fetch a single category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id).populate('products');
        console.log('Categories sent');
        if (!category) {
            return res.status(404).send({ message: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching category', error: error.message });
    }
};


// Update a category by ID
exports.updateCategoryById = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, useFindAndModify: false });
        if (!category) {
            return res.status(404).send({ message: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).send({ message: 'Error updating category', error: error.message });
    }
};

// Delete a category by ID
exports.deleteCategoryById = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).send({ message: 'Category not found' });
        }
        res.send({ message: 'Category deleted successfully', category });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting category', error: error.message });
    }
};

