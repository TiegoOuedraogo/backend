const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const adminAuth = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).send({ message: 'No token provided. Authorization denied.' });
        }
        const token = req.headers.authorization.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.user.id);

        if (!user || user.role !== 'admin') {
            return res.status(403).send({ message: 'Access denied. Admins only.' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error in adminAuth middleware', error);
        res.status(401).send({ message: 'Token is not valid' });
    }
};

module.exports = adminAuth;

