import express from "express";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.get("/profile", authenticate, (req, res) => {
  res.json({
    user: req.user,
  });
});

export default router;
