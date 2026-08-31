import express from "express";
import { z } from "zod";

import { writeMemory } from "../memory/memory.writer.js";

export const memoryRouter = express.Router();

const createMemorySchema = z.object({
  userId: z.string().min(1),

  tenantId: z.string().min(1).optional().default("default"),

  type: z.string().min(1),

  content: z.string().min(1),

  importance: z.number().min(0).max(1).optional().default(0.5),

  expiresAt: z.string().datetime().nullable().optional().default(null),
});

export function registerMemoryRoutes(app, memoryStore) {
  /*
  GET /api/memory?userId=user_001
  */

  app.get("/api/memory", async (req, res) => {
    try {
      const { userId, tenantId = "default" } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: "userId is required",
        });
      }

      const memories = await memoryStore.getAll(userId, tenantId);

      res.json({
        success: true,
        memories,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  /*
  POST /api/memory
  */

  app.post("/api/memory", async (req, res) => {
    try {
      const input = createMemorySchema.parse(req.body);

      const memory = await writeMemory(memoryStore, input);

      res.status(201).json({
        success: true,
        memory,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  });

  /*
  DELETE /api/memory/:id
  */

  app.delete("/api/memory/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const { userId, tenantId = "default" } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: "userId is required",
        });
      }

      const memory = await memoryStore.get(id);

      if (!memory) {
        return res.status(404).json({
          success: false,
          error: "Memory not found",
        });
      }

      if (memory.userId !== userId || memory.tenantId !== tenantId) {
        return res.status(403).json({
          success: false,
          error: "Not allowed to delete this memory",
        });
      }

      await memoryStore.delete(id);

      res.json({
        success: true,
        message: "Memory deleted",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });
}
