// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoriesController');
const { protect, admin } = require('../middlewares/authMiddleware'); 

// Fetch all categories
router.get('/', categoryController.getAllCategories);

// Fetch a single category by ID
router.get('/:id', categoryController.getCategoryById);

// Create a new category
// Use 'protect' and 'admin' middleware to ensure only admins can create a category
router.post('/',  categoryController.createCategory);

// Update a category by ID
// Use 'protect' and 'admin' middleware to ensure only admins can update a category
router.put('/:id', categoryController.updateCategoryById);

// Delete a category by ID
// Use 'protect' and 'admin' middleware to ensure only admins can delete a category
router.delete('/:id', categoryController.deleteCategoryById);

module.exports = router;
