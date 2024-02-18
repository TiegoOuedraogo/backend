const UserProfile = require('../models/UserProfileModel');

exports.createUserProfile = async (req, res) => {
    const { name, address, image } = req.body;
    const userId = req.user.id; 
  
    try {
      const profile = await UserProfile.findOne(
        { userId },
        { name, address, image },
        { new: true, upsert: true }
      );
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: 'Error saving user profile', error: error.message });
    }
  };

  
exports.getUserProfile = async (req, res) => {
    const userId = req.user.id; 
    console.log("THe user id", req.user.id)
    try {
        const userProfile = await UserProfile.findOne({ userId });
        console.log("THe user profile", userProfile)

        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        res.json(userProfile);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
};


exports.updateUserProfile = async (req, res) => {
    const userId = req.user.id;
    const profileUpdates = req.body;

    try {
        const updatedUserProfile = await UserProfile.findOneAndUpdate(
            { userId },
            { $set: profileUpdates },
            { new: true, upsert: true }
        );

        res.json(updatedUserProfile);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user profile', error: error.message });
    }
};

