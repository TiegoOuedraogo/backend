const express = require('express');
const orderController = require('../controllers/ordersController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Route to create a new order
router.post('/', authMiddleware, orderController.createOrder);

// Route to handle the checkout process
router.post('/checkout', authMiddleware, orderController.checkout);

// Route to list all orders for the authenticated user
router.get('/', authMiddleware, orderController.listOrders);

// Route to get details of a specific order
router.get('/:orderId', authMiddleware, orderController.getOrderDetails);

// Route to update the status of a specific order
router.put('/:orderId/status', authMiddleware, orderController.updateOrder);

module.exports = router;

