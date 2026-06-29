import { Router } from "express";
import {
  listNews,
  getNews,
  createNews,
  updateNews,
  deleteNews,
} from "../controllers/newsController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = Router();

router.get("/", listNews);
router.get("/:slug", getNews);

router.post("/", protect, restrictTo("admin", "editor"), createNews);
router.put("/:id", protect, restrictTo("admin", "editor"), updateNews);
router.delete("/:id", protect, restrictTo("admin"), deleteNews);

export default router;
