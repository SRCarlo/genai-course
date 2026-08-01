import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  getResumes,
  getResumeById,
  deleteResume,
} from "../controllers/resumeController.js";

const router = express.Router();

router.get("/", protect, getResumes);

router.get("/:id", protect, getResumeById);

router.delete("/:id", protect, deleteResume);

export default router;
