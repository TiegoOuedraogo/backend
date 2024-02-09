const UserSettings = require('../models/UserSettingsModel');

// Fetch user settings by user ID
exports.getUserSettings = async (req, res) => {
    try {
        const userId = req.user.id; 

        const userSettings = await UserSettings.findOne({ userId: userId });
        if (!userSettings) {
            return res.status(404).send({ message: 'User settings not found' });
        }

        res.json(userSettings);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching user settings', error: error.message });
    }
};

// Create or update user settings
exports.updateUserSettings = async (req, res) => {
    const userId = req.user.id; 
    const settingsUpdates = req.body.settings; 

    try {
        const userSettings = await UserSettings.findOneAndUpdate(
            { userId: userId },
            { $set: { settings: settingsUpdates } },
            { new: true, upsert: true, useFindAndModify: false }
        );

        res.json(userSettings);
    } catch (error) {
        res.status(500).send({ message: 'Error updating user settings', error: error.message });
    }
};

