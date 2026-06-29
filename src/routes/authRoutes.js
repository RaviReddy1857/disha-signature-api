import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, me } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// Throttle login attempts to slow brute-force.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many login attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/login", loginLimiter, login);
router.get("/me", protect, me);

export default router;
