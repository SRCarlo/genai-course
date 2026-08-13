import express from "express";

import { runReact } from "../controllers/reactController.js";

const router = express.Router();

router.post("/react/run", runReact);

export default router;
