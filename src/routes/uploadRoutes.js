import { Router } from "express";
import { upload, uploadFile } from "../controllers/uploadController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = Router();

router.post("/", protect, restrictTo("admin", "editor"), upload.single("file"), uploadFile);

export default router;
