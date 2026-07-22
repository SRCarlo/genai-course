import express from "express";

import { chat, history, clear, health } from "../controllers/chatController.js";

import { validateMessage } from "../middleware/validate.js";

const router = express.Router();

router.post(
  "/",

  validateMessage,

  chat,
);

router.get(
  "/history",

  history,
);

router.post(
  "/clear-history",

  clear,
);

router.get(
  "/health",

  health,
);

export default router;
