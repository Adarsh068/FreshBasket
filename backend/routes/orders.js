const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect, adminOnly } = require("../middleware/auth");
const { sendOrderConfirmation } = require("../utils/whatsapp");

// POST /api/orders - place new order

router.post("/", async (req, res) => {
  try {
    let userEmail = null;
    let userName = null;
    let userPhone = null;

    const auth = req.headers.authorization;
    if (auth && auth.startsWith("Bearer")) {
      try {
        const jwt = require("jsonwebtoken");
        const decoded = jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET);
        const User = require("../models/User");
        const u = await User.findById(decoded.id);
        console.log("DB User full object:", u)  
        if (u) {
          userEmail = u.email;
          userName = u.name;
          userPhone = u.phone;
        }
      } catch {}
    }

    const orderId = "FB" + Math.random().toString(36).slice(2, 8).toUpperCase();
    const order = await Order.create({ ...req.body, orderId, userEmail });


    // ✅ Send WhatsApp confirmation
    if (userPhone) {
      await sendOrderConfirmation({
        customerName: userName || "Customer",
        customerPhone: userPhone,
        orderId: order.orderId,
        items: req.body.items || [],
        totalAmount: req.body.totalAmount || req.body.total || 0,
      });
    } else {
      console.log("❌ WhatsApp skipped — no phone number found")
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/orders/user/mine - logged-in user sees their own orders
router.get("/user/mine", protect, async (req, res) => {
  try {
    const orders = await Order.find({ userEmail: req.user.email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders - admin: all orders
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/:id
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/orders/:id/status - admin only
router.patch("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/orders/:id - admin only
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Order.findOneAndDelete({ orderId: req.params.id });
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;