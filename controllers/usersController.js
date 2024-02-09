const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');


function isValidPassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
}


exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate the plain text password
        if (!isValidPassword(password)) {
            return res.status(400).json({
                message: 'Password must contain at least 8 characters, one uppercase, one lowercase, and one number.'
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create a new user with the hashed password
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            // ... other fields ...
        });

        // Save the new user
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: { id: newUser.id, username: newUser.username, email: newUser.email } });
    } catch (error) {
        console.error(error); // Log detailed error
        res.status(500).json({ message: 'Error registering new user', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        // Find user by email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check password
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // User matched, create JWT payload
        const payload = {
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        };

        // Sign token
        jwt.sign(
            payload,
            process.env.JWT_SECRET, 
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.updateUserById = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.send(updatedUser);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.deleteUserById = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.send({ message: 'User deleted successfully', deletedUser });
    } catch (error) {
        res.status(500).send(error); 
    }
};


//loalhost:3000/api/users/register with Post {
//     "username": "newuser",
//    "email": "newuser@example.com",
//    "password": "NewPassword123",
//    "profileInfo": {
//        "name": "New User",
//        "address": "123 New Street, New City",
//        "image": "https://example.com/images/profile/newuser12.jpg"
//    },
//    "role": "user"
// }

//login with loalhost:3000/api/users/login
// {
//     "email": "newuser@example.com",
//    "password": "NewPassword123"
// }



//loalhost:3000/api/users/register with Post {
//     "username": "newuser",
//    "email": "newuser@example.com",
//    "password": "NewPassword123",
//    "profileInfo": {
//        "name": "New User",
//        "address": "123 New Street, New City",
//        "image": "https://example.com/images/profile/newuser12.jpg"
//    },
//    "role": "user"
// }

//login with loalhost:3000/api/users/login
// {
//     "email": "newuser@example.com",
//    "password": "NewPassword123"
// }


