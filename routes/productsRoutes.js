const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

router.post('/', productsController.createProduct);
router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getProductById);
router.put('/:id', productsController.updateProductById);
router.delete('/:id', productsController.deleteProductById);

module.exports = router;
