import express from "express";

import { chatWithAgent } from "../controllers/agentController.js";

const router = express.Router();

router.post("/chat", chatWithAgent);

export default router;
