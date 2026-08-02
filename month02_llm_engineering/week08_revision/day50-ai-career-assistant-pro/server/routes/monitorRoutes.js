import express from "express";

import { getLogs } from "../controllers/monitorController.js";

const router = express.Router();

router.get("/", getLogs);

export default router;
