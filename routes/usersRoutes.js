const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
//const authMiddleware = require('../middlewares/authMiddleware');

// console.log(usersController.register);
// Create a user
router.post('/register', usersController.register);

//login
router.post('/login', usersController.login);

// Get all users
router.get('/', usersController.getAllUsers);

// Get a single user by id
router.get('/:id', usersController.getUserById);

// Update a user by id
router.put('/:id', usersController.updateUserById);

// Delete a user by id
router.delete('/:id', usersController.deleteUserById);

module.exports = router;

