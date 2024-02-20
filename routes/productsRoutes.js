const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', productsController.createProduct);
router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getProductById);
router.put('/:id', productsController.updateProductById);
router.delete('/:id', productsController.deleteProductById);
router.get('/fiter', productsController.getProductFilter)

module.exports = router;

