import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  createLead,
  listLeads,
  updateLead,
  deleteLead,
  leadStats,
} from "../controllers/leadController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = Router();

// Limit public form spam.
const formLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: { message: "Too many submissions. Please try again shortly." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", formLimiter, createLead);

router.get("/", protect, listLeads);
router.get("/stats", protect, leadStats);
router.patch("/:id", protect, updateLead);
router.delete("/:id", protect, restrictTo("admin"), deleteLead);

export default router;
