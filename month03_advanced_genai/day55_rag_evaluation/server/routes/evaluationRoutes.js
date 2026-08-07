import express from "express";

import { runEvaluation } from "../controllers/evaluationController.js";

const router = express.Router();

router.get("/run", runEvaluation);

export default router;
