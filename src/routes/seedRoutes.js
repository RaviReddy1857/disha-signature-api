import { Router } from "express";
import { runSeed } from "../controllers/seedController.js";

const router = Router();

// Both GET and POST supported so it can be triggered from a browser URL.
router.get("/", runSeed);
router.post("/", runSeed);

export default router;
