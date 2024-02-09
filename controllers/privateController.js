const UserSettings = require('../models/UserSettingsModel'); 

//private endpoint that requires authentication.
exports.getPrivateData = async (req, res) => {
    try {
        // req.user has to contains the user's ID after successful authentication
        const userId = req.user.id;

        // Fetch user-specific data from the database. 
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

