const express = require('express');
const router = express.Router();
const adminAuth = require('../middlewares/adminAuth');
const adminController = require('../controllers/adminController');

router.use(adminAuth); 

// User management
router.get('/users',adminAuth, adminController.getAllUsers);
router.get('/user/:id',adminAuth, adminController.getUserById);
router.post('/user', adminAuth,adminController.createUser);
router.put('/user/:id',adminAuth, adminController.updateUserById);
router.delete('/user/:id', adminAuth,adminController.deleteUserById);

// Product management
router.get('/products', adminAuth,adminController.getAllProducts);
router.get('/product/:id', adminAuth,adminController.getProductById);
router.post('/product', adminAuth,adminController.createProduct);
router.put('/product/:id', adminAuth,adminController.updateProductById);
router.delete('/product/:id', adminAuth,adminController.deleteProductById);

// Order management
router.get('/orders', adminAuth,adminController.getAllOrders);
router.get('/order/:id', adminAuth,adminController.getOrderById);
router.post('/order', adminAuth,adminController.createOrder);
router.put('/order/:id', adminAuth,adminController.updateOrderById);
router.delete('/order/:id', adminAuth,adminController.deleteOrderById);

// CartItem management
router.get('/cartItems', adminAuth,adminController.getAllCartItems);
router.post('/cartItem/:id', adminAuth,adminController.createUserCartItem);
router.get('/cartItem', adminAuth,adminController.getUserCartItems);
router.get('/cartItem', adminAuth,adminController.getAllCarts);
router.put('/cartItem', adminAuth,adminController.updateCartItemQuantity);
router.delete('/cartItem/:id', adminAuth,adminController.deleteCartItemById);

// Cart management
router.get('/carts',adminAuth, adminController.getAllCarts);
router.get('/cart/:id', adminAuth,adminController.getCartById);
router.post('/cart', adminAuth,adminController.createCart);
router.put('/cart/:id', adminAuth,adminController.updateCartById);
router.delete('/cart/:id', adminAuth,adminController.deleteCartById);

// Category management
router.get('/categories',adminAuth, adminController.getAllCategories);
router.get('/category/:id', adminAuth,adminController.getCategoryById);
router.post('/category', adminAuth,adminController.createCategory);
router.put('/category', adminAuth,adminController.updateCategory);
router.delete('/category', adminAuth,adminController.deleteCategory);

// Review management
router.get('/reviews', adminAuth,adminController.getAllReviews);
router.get('/review/:id',adminAuth, adminController.getReviewById);
router.post('/review', adminAuth,adminController.createReview);
router.put('/review', adminAuth,adminController.updateReview);
router.delete('/review', adminAuth,adminController.deleteReview);

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
