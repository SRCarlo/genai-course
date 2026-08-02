import express from "express";

import {
  saveConversation,
  fetchConversation,
} from "../controllers/memoryController.js";

const router = express.Router();

router.post("/save", saveConversation);

router.get("/:sessionId", fetchConversation);

export default router;
