// privateRoutes.js
const express = require('express');
const { getPrivateData } = require('../controllers/privateController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

//to protect the route
router.route('/').get(authMiddleware, getPrivateData);

module.exports = router;
