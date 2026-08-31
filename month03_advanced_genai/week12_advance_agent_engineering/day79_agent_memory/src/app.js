import express from "express";
import dotenv from "dotenv";

import { MemoryStore } from "./memory/memory.store.js";

import { registerChatRoutes } from "./routes/chat.routes.js";

import { registerMemoryRoutes } from "./routes/memory.routes.js";

dotenv.config();

export function createApp() {
  const app = express();

  app.use(express.json());

  const memoryStore = new MemoryStore();

  app.get("/", (req, res) => {
    res.json({
      message: "Day 79 Agent Memory API",
      model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
    });
  });

  app.get("/health", (req, res) => {
    res.json({
      status: "ok",
    });
  });

  registerChatRoutes(app, memoryStore);

  registerMemoryRoutes(app, memoryStore);

  return app;
}
