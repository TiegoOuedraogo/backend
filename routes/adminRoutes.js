const express = require('express');
const router = express.Router();
const adminAuth = require('../middlewares/adminAuth');
const adminController = require('../controllers/adminController');

router.use(adminAuth); 

// User management
router.get('/users', adminController.getAllUsers);
router.get('/user/:id', adminController.getUserById);
router.post('/user', adminController.createUser);
router.put('/user/:id', adminController.updateUserById);
router.delete('/user/:id', adminController.deleteUserById);


// Product management
router.get('/products', adminController.getAllProducts);
router.get('/products/:id', adminController.getProductById);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProductById);
router.delete('/products/:id', adminController.deleteProductById);


// Order management
router.get('/orders', adminController.getAllOrders);
router.get('/order/:id', adminController.getOrderById);
router.post('/order', adminController.createOrder);
router.put('/order/:id', adminController.updateOrderById);
router.delete('/order/:id', adminController.deleteOrderById);

// CartItem management
router.get('/cartItems', adminController.getAllCartItems);
router.post('/cartItem/:id', adminController.createUserCartItem);
router.get('/cartItem', adminController.getUserCartItems);
router.get('/cartItem', adminController.getAllCarts);
router.put('/cartItem', adminController.updateCartItemQuantity);
router.delete('/cartItem/:id', adminController.deleteCartItemById);

// Cart management
router.get('/carts', adminController.getAllCarts);
router.get('/cart/:id', adminController.getCartById);
router.post('/cart', adminController.createCart);
router.put('/cart/:id', adminController.updateCartById);
router.delete('/cart/:id', adminController.deleteCartById);

// Category management
router.get('/categories', adminController.getAllCategories);
router.get('/category/:id', adminController.getCategoryById);
router.post('/category', adminController.createCategory);
router.put('/category', adminController.updateCategory);
router.delete('/category', adminController.deleteCategory);


// Review management
router.get('/reviews', adminController.getAllReviews);
router.get('/review/:id', adminController.getReviewById);
router.post('/review', adminController.createReview);
router.put('/review', adminController.updateReview);
router.delete('/review', adminController.deleteReview);

// // Comment management
// router.get('/comments', adminController.getAllComments);
// router.get('/comment/:id', adminController.getCommentById);
// router.post('/comment', adminController.createComment);
// router.put('/comment/:id', adminController.updateCommentById);
// router.delete('/comment/:id', adminController.deleteCommentById);

// // Promotion management
// router.get('/promotions', adminController.getAllPromotions);
// router.get('/promotion/:id', adminController.getPromotionById);
// router.post('/promotion', adminController.createPromotion);
// router.put('/promotion/:id', adminController.updatePromotionById);
// router.delete('/promotion/:id', adminController.deletePromotionById);


// // UserSetting management
// router.get('/userSettings', adminController.getAllUserSettings);
// router.get('/userSetting/:id', adminController.getUserSettingById);
// router.post('/userSetting', adminController.createUserSetting);
// router.put('/userSetting/:id', adminController.updateUserSettingById);
// router.delete('/userSetting/:id', adminController.deleteUserSettingById);

module.exports = router;
