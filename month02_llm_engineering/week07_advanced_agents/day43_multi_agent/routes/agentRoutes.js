import express from "express";
import { run } from "../controllers/agentController.js";

const router = express.Router();

router.post("/run", run);

export default router;
