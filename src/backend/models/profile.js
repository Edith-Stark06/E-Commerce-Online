const express = require("express");
const User = require("./User");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// Get User Profile
router.get("/", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ auth0Id: req.user.auth0Id })
            .populate("orders.items.productId");
        
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile", error });
    }
});

// Update Address
router.put("/update-address", authMiddleware, async (req, res) => {
    try {
        const { address } = req.body;
        const user = await User.findOneAndUpdate(
            { auth0Id: req.user.auth0Id }, 
            { address }, 
            { new: true }
        );
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error updating address", error });
    }
});

module.exports = router;