import express from "express";

import { askAgent } from "../controllers/agentController.js";

const router = express.Router();

router.post("/ask", askAgent);

export default router;
