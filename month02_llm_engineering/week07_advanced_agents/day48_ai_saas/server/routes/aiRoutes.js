import express from "express";

import { analyzeResume } from "../controllers/aiController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { usageLimit } from "../middleware/usageMiddleware.js";

const router = express.Router();

router.post(
    "/analyze",
    authMiddleware,
    usageLimit(100),
    analyzeResume
);

export default router;
