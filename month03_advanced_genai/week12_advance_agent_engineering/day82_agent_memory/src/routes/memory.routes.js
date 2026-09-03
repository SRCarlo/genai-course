import express from "express";
import { MemoryAgent } from "../agents/memory.agent.js";
import { memoryStore } from "../storage/memory.store.js";

const router = express.Router();

const agent = new MemoryAgent();

// POST /api/chat/:userId
router.post("/chat/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "message is required",
      });
    }

    const result = await agent.chat(userId, message);

    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: "Failed to process chat",
    });
  }
});

// GET /api/memory/:userId
router.get("/memory/:userId", (req, res) => {
  const { userId } = req.params;

  const memories = memoryStore.get(userId);

  res.json({
    success: true,
    memories,
  });
});

// DELETE /api/memory/:userId/:memoryId
router.delete("/memory/:userId/:memoryId", (req, res) => {
  const { userId, memoryId } = req.params;

  const deleted = memoryStore.delete(userId, memoryId);

  res.json({
    success: true,
    deleted,
  });
});

// DELETE /api/memory/:userId
router.delete("/memory/:userId", (req, res) => {
  const { userId } = req.params;

  memoryStore.clear(userId);

  res.json({
    success: true,
    message: "All memories deleted",
  });
});

export default router;
