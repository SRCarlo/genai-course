import express from "express";

import upload from "../config/multer.js";

import protect from "../middleware/authMiddleware.js";

import { uploadResume } from "../controllers/resumeController.js";

const router = express.Router();

router.post(
  "/upload",

  protect,

  upload.single("resume"),

  uploadResume,
);

export default router;
