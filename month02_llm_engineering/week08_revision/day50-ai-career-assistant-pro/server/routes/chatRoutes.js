import express from "express";

import { chat } from "../controllers/chatController.js";
import { validateChatRequest } from "../middleware/guardrails.js";

const router = express.Router();

router.post("/", validateChatRequest, chat);

export default router;
