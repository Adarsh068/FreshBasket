const express = require("express");
const router = express.Router();
const Subscription = require("../models/Subscription");
const { protect, adminOnly } = require("../middleware/auth");
const { sendSubscriptionConfirmation } = require("../utils/whatsapp");
const fileSubscriptions = require("../config/file-subscriptions");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const fileUsers = require("../config/file-users");

// POST /api/subscriptions - create (public)
router.post("/", async (req, res) => {
  try {
    console.log("=== SUBSCRIPTION POST HIT ===")
    console.log("Body:", JSON.stringify(req.body))
    const subscriptionId = "SUB" + Math.random().toString(36).slice(2, 8).toUpperCase();
    let userEmail = null;
    let authenticatedUser = null;
    const auth = req.headers.authorization;
    if (auth && auth.startsWith("Bearer")) {
      try {
        const decoded = jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET);
        const user = User.db.readyState === 1
          ? await User.findById(decoded.id).select("-password")
          : await fileUsers.findById(decoded.id);
        if (user) {
          authenticatedUser = user;
          userEmail = user.email;
        }
      } catch {}
    }
    if (authenticatedUser?.role === "admin") {
      return res.status(403).json({ message: "Admin accounts cannot create customer subscriptions" });
    }
    let sub;
    if (Subscription.db.readyState === 1) {
      sub = await Subscription.create({ ...req.body, subscriptionId, userEmail });
    } else {
      sub = fileSubscriptions.createSubscription({ ...req.body, subscriptionId, userEmail });
    }

    // ✅ Send WhatsApp - phone comes directly from subscription form
    if (req.body.phone) {
      await sendSubscriptionConfirmation({
        customerName: req.body.customerName || "Customer",
        customerPhone: req.body.phone,
        subscriptionId: sub.subscriptionId,
        planName: req.body.planName,
        frequency: req.body.frequency,
        price: req.body.price,
      });
    }

    res.status(201).json(sub);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/subscriptions/user/mine - logged-in user sees their subscriptions
router.get("/user/mine", protect, async (req, res) => {
  try {
    const subs = Subscription.db.readyState === 1
      ? await Subscription.find({ userEmail: req.user.email }).sort({ createdAt: -1 })
      : fileSubscriptions.findByUserEmail(req.user.email);
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/subscriptions - admin only
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const subs = await Subscription.find().sort({ createdAt: -1 });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/subscriptions/:id/status - admin only
router.patch("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const sub = await Subscription.findOneAndUpdate(
      { subscriptionId: req.params.id },
      { status: req.body.status },
      { new: true }
    );
    if (!sub) return res.status(404).json({ message: "Subscription not found" });
    res.json(sub);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/subscriptions/:id - admin only
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Subscription.findOneAndDelete({ subscriptionId: req.params.id });
    res.json({ message: "Subscription deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;