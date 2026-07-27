import express from "express";

import { save, history } from "../controllers/memoryController.js";

const router = express.Router();

router.post("/save", save);

router.get("/history", history);

export default router;
