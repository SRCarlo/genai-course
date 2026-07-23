import express from "express";

import {
  agentController,
  historyController,
} from "../controllers/agentController.js";

const router = express.Router();

router.post(
  "/agent",

  agentController,
);

router.get(
  "/history",

  historyController,
);

export default router;
