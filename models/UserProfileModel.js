const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: String,
    image: String,
    role: { type: String, required: true },
});

module.exports = mongoose.model('UserProfile', userProfileSchema);

