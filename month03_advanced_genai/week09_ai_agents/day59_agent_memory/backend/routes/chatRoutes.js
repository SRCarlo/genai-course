import express from "express";

import { chatController } from "../controllers/chatController.js";

import { clearChatMemory } from "../controllers/memoryController.js";

import { getHistory } from "../controllers/historyController.js";

const router = express.Router();

router.post("/chat", chatController);

router.get("/chat/:sessionId/history", getHistory);

router.delete("/chat/:sessionId", clearChatMemory);

export default router;
