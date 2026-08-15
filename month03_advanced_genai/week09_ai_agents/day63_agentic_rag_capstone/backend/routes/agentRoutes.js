import express from "express";

import { runAgenticRag } from "../controllers/agentController.js";

import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/agentic-rag", validateRequest, runAgenticRag);

export default router;
