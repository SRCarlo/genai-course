import express from "express";

import upload from "../middleware/uploadMiddleware.js";

import protect from "../middleware/authMiddleware.js";

import usageLimit from "../middleware/usageMiddleware.js";

import { analyze } from "../controllers/aiController.js";

const router = express.Router();

router.post(
  "/analyze",

  protect,

  usageLimit,

  upload.single("resume"),

  analyze,
);

export default router;
