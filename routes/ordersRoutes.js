const express = require('express');
const orderController = require('../controllers/ordersController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();


router.post('/', authMiddleware, orderController.createOrder);
router.post('/checkout', authMiddleware, orderController.checkout);
router.get('/', authMiddleware, orderController.listOrders);
router.get('/:orderId', authMiddleware, orderController.getOrderDetails);
router.put('/:orderId/status', authMiddleware, orderController.updateOrder);
router.delete('/cancel/:orderId',authMiddleware, orderController.cancelOrder);


module.exports = router;


