import express from "express";

import { z } from "zod";

import { runWorkflow } from "../orchestration/workflow.js";

const router = express.Router();

const requestSchema = z.object({
  task: z.string().min(3).max(10000),
});

router.post("/run", async (req, res) => {
  try {
    const parsed = requestSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,

        error: "Invalid request",

        details: parsed.error.issues,
      });
    }

    const result = await runWorkflow(parsed.data.task);

    return res.json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,

      error: error.message,
    });
  }
});

export default router;
