import express from "express";
import dotenv from "dotenv";

import { runAgent } from "../agents/agent.js";

import { addMessage, getHistory } from "../memory/memory.js";

import { calculator } from "../tools/calculator.js";

dotenv.config();

const app = express();

app.use(express.json());

// Home route

app.get("/", (req, res) => {
  res.json({
    message: "LangChain AI Assistant API Running",
  });
});

// Chat API

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    addMessage("user", message);

    const response = await runAgent(message);

    addMessage("assistant", response);

    res.json({
      response,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// Tool API

app.post("/tool", (req, res) => {
  try {
    const { expression } = req.body;

    const result = calculator(expression);

    res.json({
      result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// Memory API

app.get("/history", (req, res) => {
  res.json({
    history: getHistory(),
  });
});

// Start Server

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
