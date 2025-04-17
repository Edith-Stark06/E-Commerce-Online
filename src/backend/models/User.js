const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    auth0Id: { type: String, required: true, unique: true }, // Auth0 User ID
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    address: { type: String },
    profilePicture: { type: String },
    preferences: {
        notifications: { type: Boolean, default: true },
        newsletter: { type: Boolean, default: true },
        theme: { type: String, default: 'light' }
    },
    orders: [{
        orderId: String,
        items: [{
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: Number,
        }],
        totalPrice: Number,
        orderDate: { type: Date, default: Date.now },
    }]
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add any virtual properties or methods here if needed

module.exports = mongoose.model("User", UserSchema);
