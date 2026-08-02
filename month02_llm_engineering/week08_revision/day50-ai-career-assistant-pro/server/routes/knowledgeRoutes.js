import express from "express";

import upload from "../config/multer.js";

import { uploadKnowledge } from "../controllers/knowledgeController.js";

const router = express.Router();

router.post(
  "/upload",

  upload.single("document"),

  uploadKnowledge,
);

export default router;
