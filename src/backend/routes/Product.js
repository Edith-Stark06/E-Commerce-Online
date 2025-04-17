const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, required: true },
    category: { type: String },
    image: { type: String },
    stock: { type: Number, required: true }
});

module.exports = mongoose.model("Product", ProductSchema);
