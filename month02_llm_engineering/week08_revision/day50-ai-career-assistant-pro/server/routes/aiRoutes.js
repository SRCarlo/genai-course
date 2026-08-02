import express from "express";

import { reviewResume } from "../controllers/aiController.js";

const router = express.Router();

router.post("/resume-review", reviewResume);

export default router;
