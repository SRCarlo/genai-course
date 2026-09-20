import { Router } from "express";
import { chatController } from "../controllers/chat.controller.js";

const router = Router();
router.post("/", chatController);
export default router;
