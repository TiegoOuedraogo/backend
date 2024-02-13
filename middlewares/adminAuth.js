const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');


const adminAuth = (req, res, next) => {
    try {
        console.log('Headers:', req.headers); 
        const authHeader = req.header('authorization');
        console.log('Authorization Header:', authHeader);

        if (!authHeader) {
            return res.status(401).send({ message: 'No authorization header' });
        }

        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; 
        next();
    } catch (error) {
        console.log('Auth middleware error:', error); 
        res.status(401).send({ message: 'Not authorized, token failed' });
    }
};

module.exports = adminAuth;

