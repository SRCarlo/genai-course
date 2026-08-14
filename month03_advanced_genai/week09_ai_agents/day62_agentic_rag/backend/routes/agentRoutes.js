import { Router } from "express";

import { runAgenticRag } from "../controllers/agentController.js";

const router = Router();

router.post("/agentic-rag", runAgenticRag);

export default router;
