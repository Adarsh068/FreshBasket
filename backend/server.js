require("dotenv").config();
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "freshbasket-local-development-secret";
  console.warn("⚠️ JWT_SECRET missing; using a local development secret");
}
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// ── Connect DB ───────────────────────────────────────────────────────────────
let databaseReady = false;
let fileFallbackReady = false;
connectDB().then((connected) => {
  databaseReady = connected;
});
if (!process.env.MONGODB_URI) {
  fileFallbackReady = true;
  console.warn("⚠️ MONGODB_URI missing; using local file-based auth fallback");
}

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "http://localhost:3000",
    "http://localhost:3001",
    "https://freshbasket-frontend-hjj6.onrender.com",
  ],
  credentials: true,
}));
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth",          require("./routes/auth"));
app.use("/api/products",      require("./routes/products"));
app.use("/api/orders",        require("./routes/orders"));
app.use("/api/subscriptions", require("./routes/subscriptions"));

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (_, res) => {
  const ready = databaseReady || fileFallbackReady;
  res.status(ready ? 200 : 503).json({
    status: ready ? "OK" : "DATABASE_UNAVAILABLE",
    database: databaseReady ? "mongodb" : "file-fallback",
    time: new Date(),
  });
});

// ── 404 handler ──────────────────────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ message: "Route not found" }));

// ── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));