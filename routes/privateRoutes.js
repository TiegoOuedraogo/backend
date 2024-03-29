const express = require('express');
const { getPrivateData } = require('../controllers/privateController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').get(authMiddleware, getPrivateData);

module.exports = router;
