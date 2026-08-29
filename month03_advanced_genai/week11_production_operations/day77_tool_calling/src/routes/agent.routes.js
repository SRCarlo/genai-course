import express from "express";
import { runAgent } from "../agent/agent.js";

const router = express.Router();

router.post("/run", async (req, res) => {
  try {
    const { message, userRole = "customer" } = req.body;

    if (typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "message is required",
      });
    }

    const result = await runAgent({
      message,
      userRole,
    });

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Agent execution failed",
    });
  }
});

export default router;
