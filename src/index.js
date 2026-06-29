import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/error.js";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import seedRoutes from "./routes/seedRoutes.js";

const app = express();

// ─── Core middleware ─────────────────────────────────────
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

const origins = (process.env.CLIENT_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((s) => s.trim());
app.use(cors({ origin: origins, credentials: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Global, lenient rate limit (per-route limiters are stricter).
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// ─── Health check ────────────────────────────────────────
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", service: "disha-signature-api", time: new Date().toISOString() })
);

// ─── Routes ──────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/seed", seedRoutes);

// ─── Errors ──────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start ───────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✓ API running on http://localhost:${PORT}`);
    console.log(`  Allowed origins: ${origins.join(", ")}`);
  });
});

export default app;
