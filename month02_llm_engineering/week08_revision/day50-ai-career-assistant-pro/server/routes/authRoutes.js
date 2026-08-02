import express from "express";

import { signup, login, profile } from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/profile", protect, profile);

export default router;
