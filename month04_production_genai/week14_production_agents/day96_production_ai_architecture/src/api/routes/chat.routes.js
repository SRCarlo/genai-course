import { Router } from "express";

import { chatController } from "../controllers/chat.controller.js";

import { validate, chatSchema } from "../middleware/validate.js";

const router = Router();

router.post(
  "/chat",

  validate(chatSchema),

  chatController,
);

export default router;
