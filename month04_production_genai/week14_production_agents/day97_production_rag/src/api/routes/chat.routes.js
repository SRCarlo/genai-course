import express from "express";
import { auth } from "../middleware/auth.js";
import { createChatController } from "../controllers/chat.controller.js";

export function createChatRouter(chatService) {
  const router = express.Router();

  const controller = createChatController(chatService);

  router.post("/chat", auth, controller);

  return router;
}
