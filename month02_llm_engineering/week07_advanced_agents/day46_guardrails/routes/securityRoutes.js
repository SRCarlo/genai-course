import express from "express";

import { ask } from "../controllers/securityController.js";

import { securityMiddleware } from "../middleware/securityMiddleware.js";

const router = express.Router();

router.post("/chat", securityMiddleware, ask);

export default router;
