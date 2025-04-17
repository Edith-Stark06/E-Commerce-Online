const User = require("../models/User");

const auth0Sync = async (req, res, next) => {
    try {
        if (!req.user || !req.user.auth0Id) {
            return res.status(401).json({ message: "Unauthorized - No Auth0 user found" });
        }

        // Check if user exists in MongoDB
        let user = await User.findOne({ auth0Id: req.user.auth0Id });

        // If user doesn't exist, create a new one
        if (!user) {
            user = await User.create({
                auth0Id: req.user.auth0Id,
                name: req.user.name || req.user.nickname,
                email: req.user.email,
                profilePicture: req.user.picture
            });
        }

        // Attach the MongoDB user to the request
        req.mongoUser = user;
        next();
    } catch (error) {
        console.error("Auth0 Sync Error:", error);
        res.status(500).json({ message: "Error syncing user with database", error: error.message });
    }
};

module.exports = auth0Sync; 