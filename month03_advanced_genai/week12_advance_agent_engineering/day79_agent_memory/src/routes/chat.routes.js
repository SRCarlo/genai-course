import express from "express";
import { z } from "zod";

import { Agent } from "../agent/agent.js";
import { AgentState } from "../agent/state.js";
import { ShortTermMemory } from "../memory/short-term.memory.js";

export const chatRouter = express.Router();

const sessions = new Map();

const chatSchema = z.object({
  userId: z.string().min(1),

  tenantId: z.string().min(1).optional().default("default"),

  sessionId: z.string().min(1).optional(),

  message: z.string().min(1),
});

export function createSessionKey({ userId, tenantId, sessionId }) {
  return [tenantId, userId, sessionId || "default"].join(":");
}

export function getOrCreateAgent({ userId, tenantId, sessionId, memoryStore }) {
  const key = createSessionKey({
    userId,
    tenantId,
    sessionId,
  });

  if (sessions.has(key)) {
    return sessions.get(key);
  }

  const shortTermMemory = new ShortTermMemory(
    Number(process.env.MAX_SHORT_TERM_MESSAGES || 20),
  );

  const state = new AgentState({
    userId,
    tenantId,
  });

  const agent = new Agent({
    shortTermMemory,
    memoryStore,
    state,
  });

  sessions.set(key, agent);

  return agent;
}

export function registerChatRoutes(app, memoryStore) {
  app.post("/api/chat", async (req, res) => {
    try {
      const input = chatSchema.parse(req.body);

      const agent = getOrCreateAgent({
        userId: input.userId,

        tenantId: input.tenantId,

        sessionId: input.sessionId,

        memoryStore,
      });

      const result = await agent.chat(input.message);

      res.json({
        success: true,

        userId: input.userId,

        sessionId: input.sessionId || "default",

        ...result,
      });
    } catch (error) {
      console.error(error);

      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  });
}
