const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const UserProfile = require('../models/UserProfileModel');

function isValidPassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
}


// exports.register = async (req, res) => {
//     try {
//         const { username, email, password } = req.body;

//         // Validate the plain text password
//         if (!isValidPassword(password)) {
//             return res.status(400).json({
//                 message: 'Password must contain at least 8 characters, one uppercase, one lowercase, and one number.'
//             });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 12);

//         // Create a new user with the hashed password
//         const newUser = new User({
//             username,
//             email,
//             password: hashedPassword,
//         });

//         // Save the new user
//         await newUser.save();

//         res.status(201).json({ message: 'User created successfully', user: { id: newUser.id, username: newUser.username, email: newUser.email } });
//     } catch (error) {
//         console.error(error); 
//         res.status(500).json({ message: 'Error registering new user', error: error.message });
//     }
// };


exports.register = async (req, res) => {
    try {
        const { username, email, password,name} = req.body; 

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
        });

        // Save the new user
        await newUser.save();

        // After saving the user, create a profile for this user
        const newUserProfile = new UserProfile({
            userId: newUser._id, 
            name: name || '', 
            email: email, 
            // address: address || '',
            role: 'user', 
            
        });

        // Save the new user profile
        await newUserProfile.save();

        res.status(201).json({
            message: 'User and profile created successfully',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUserProfile.role
            },
            profile: {
                id: newUserProfile.id,
                name: newUserProfile.name,
                // address: newUserProfile.address
            }
        });
    } catch (error) {
        console.error(error); 
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

        // Fetch the user profile to get the role
        const userProfile = await UserProfile.findOne({ userId: user._id });
        if (!userProfile) {
            return res.status(401).json({ message: "User profile not found" });
        }

        // User matched, create JWT payload
        const payload = {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: userProfile.role
            }
        };

        // Sign token
        jwt.sign(
            payload,
            process.env.JWT_SECRET, 
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: payload.user });
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
