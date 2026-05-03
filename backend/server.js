require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// ── Connect DB ───────────────────────────────────────────────────────────────
connectDB();

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth",          require("./routes/auth"));
app.use("/api/products",      require("./routes/products"));
app.use("/api/orders",        require("./routes/orders"));
app.use("/api/subscriptions", require("./routes/subscriptions"));

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (_, res) => res.json({ status: "OK", time: new Date() }));

// ── 404 handler ──────────────────────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ message: "Route not found" }));

// ── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
