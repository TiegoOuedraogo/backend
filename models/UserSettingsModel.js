const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSettingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true,
        unique: true, 
    },
    settings: {
        theme: {
            type: String,
            enum: ['light', 'dark'],
            default: 'light',
        },
        notificationsEnabled: {
            type: Boolean,
            default: true,
        },
        language: {
            type: String,
            default: 'en', 
        },
       
    },
}, { timestamps: true });

const UserSettings = mongoose.model('UserSettings', userSettingsSchema);
module.exports = UserSettings;
