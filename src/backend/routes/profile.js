const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();

// Get User Profile
router.get("/", authMiddleware, async (req, res) => {
    try {
        // Use the synced MongoDB user
        const user = await User.findById(req.mongoUser._id)
            .populate("orders.items.productId")
            .select("-__v");
        
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile", error: error.message });
    }
});

// Update Profile Details
router.put("/update", authMiddleware, async (req, res) => {
    try {
        const { name, email, phoneNumber, address, preferences } = req.body;
        
        // Validate email if provided
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "Invalid email format" });
            }
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (phoneNumber) updateData.phoneNumber = phoneNumber;
        if (address) updateData.address = address;
        if (preferences) updateData.preferences = preferences;

        // Update using the synced MongoDB user ID
        const user = await User.findByIdAndUpdate(
            req.mongoUser._id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-__v");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
});

// Update Profile Picture
router.put("/update-picture", authMiddleware, async (req, res) => {
    try {
        const { profilePicture } = req.body;
        
        if (!profilePicture) {
            return res.status(400).json({ message: "Profile picture URL is required" });
        }

        // Update using the synced MongoDB user ID
        const user = await User.findByIdAndUpdate(
            req.mongoUser._id,
            { $set: { profilePicture } },
            { new: true }
        ).select("-__v");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Profile picture updated successfully",
            user
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile picture", error: error.message });
    }
});

// Delete Profile
router.delete("/", authMiddleware, async (req, res) => {
    try {
        // Delete using the synced MongoDB user ID
        const user = await User.findByIdAndDelete(req.mongoUser._id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting profile", error: error.message });
    }
});

module.exports = router; 