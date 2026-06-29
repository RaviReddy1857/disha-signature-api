import { Router } from "express";
import {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = Router();

router.get("/", listProjects);
router.get("/:slug", getProject);

router.post("/", protect, restrictTo("admin", "editor"), createProject);
router.put("/:id", protect, restrictTo("admin", "editor"), updateProject);
router.delete("/:id", protect, restrictTo("admin"), deleteProject);

export default router;
