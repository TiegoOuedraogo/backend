const UserSettings = require('../models/UserSettingsModel'); 

exports.getPrivateData = async (req, res) => {
    try {
        const userId = req.user.id;

        const userSettings = await UserSettings.findOne({ userId });

        if (!userSettings) {
            return res.status(404).json({ message: "User settings not found." });
        }

        res.json({
            message: "This is private data specific to the authenticated user.",
            user: req.user, 
            settings: userSettings, 
        });
    } catch (error) {
        console.error('Error fetching private data:', error);
        res.status(500).send({ message: 'Error fetching private data', error: error.message });
    }
};

