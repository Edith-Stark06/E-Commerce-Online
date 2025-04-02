const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    auth0Id: { type: String, required: true, unique: true }, // Auth0 User ID
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String },
    orders: [{
        orderId: String,
        items: [{
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: Number,
        }],
        totalPrice: Number,
        orderDate: { type: Date, default: Date.now },
    }]
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
