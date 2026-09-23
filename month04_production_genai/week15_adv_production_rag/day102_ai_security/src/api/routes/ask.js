import { Router } from "express";
import { requireUser } from "../middleware/auth.js";
import { securityMiddleware } from "../middleware/security.js";
import { askController } from "../controllers/ask-controller.js";

const router = Router();

router.post("/ask", requireUser, securityMiddleware, askController);

export default router;
