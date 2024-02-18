const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/UserProfileController');
const authMiddleware = require('../middlewares/authMiddleware'); 

router.get('/profile', authMiddleware, userProfileController.getUserProfile);
router.put('/profile', authMiddleware, userProfileController.updateUserProfile);

module.exports = router;

