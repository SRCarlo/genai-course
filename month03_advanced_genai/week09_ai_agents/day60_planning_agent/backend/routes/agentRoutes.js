import express from "express";

import { runAgent } from "../controllers/agentController.js";

const router = express.Router();

router.post("/agent/run", runAgent);

export default router;
