const express = require("express");
const Cart = require("../models/Cart");
const router = express.Router();

// Add an item to the cart
router.post("/add", async (req, res) => {
  const { userId, productId, title, price } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find((item) => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ productId, title, price, quantity: 1 });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error adding item to cart" });
  }
});

// Get cart items for a user
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.json(cart ? cart.items : []);
  } catch (error) {
    res.status(500).json({ error: "Error fetching cart items" });
  }
});

// Remove an item from the cart
router.post("/remove", async (req, res) => {
  const { userId, productId } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      cart.items = cart.items.filter((item) => item.productId !== productId);
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error removing item from cart" });
  }
});

module.exports = router;
