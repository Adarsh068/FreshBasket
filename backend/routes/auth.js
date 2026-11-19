const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const fileUsers = require("../config/file-users");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email and password required" });

    let user;
    if (User.db.readyState === 1) {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: "User already exists" });
      user = await User.create({ name, email, phone, password });
    } else {
      try {
        user = await fileUsers.createUser({ name, email, phone, password });
      } catch (error) {
        if (error.code === 11000) {
          return res.status(400).json({ message: "User already exists" });
        }
        throw error;
      }
    }
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    let user;
    let passwordMatches = false;
    if (User.db.readyState === 1) {
      user = await User.findOne({ email });
      passwordMatches = Boolean(user && await user.matchPassword(password));
    } else {
      user = await fileUsers.findByEmail(email);
      passwordMatches = Boolean(user && await fileUsers.matchPassword(user, password));
    }
    if (!passwordMatches)
      return res.status(401).json({ message: "Invalid email or password" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;
