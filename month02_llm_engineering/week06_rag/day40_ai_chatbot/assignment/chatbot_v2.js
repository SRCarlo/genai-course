/*

Day 40 Assignment
GenAI Assistant v2


Features
--------
 - Memory
 - Simple RAG
 - Prompt Template
 - Logging
 - Health Check
 - Clear History
 - Error Handling
*/

import model from "../config/groq.js";
import SYSTEM_PROMPT from "../prompts/systemPrompt.js";

import { addMessage, getHistory, clearHistory } from "../memory/chatMemory.js";

import { retrieveContext } from "../rag/retriever.js";

/*
POST /chat
*/
export async function chat(req, res) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    console.log("User:", message);

    addMessage("user", message);

    const context = retrieveContext(message);

    const prompt = `
${SYSTEM_PROMPT}

Context:
${context}

Conversation History:
${JSON.stringify(getHistory(), null, 2)}

User Question:
${message}

Answer:
`;

    const response = await model.invoke(prompt);

    addMessage("assistant", response.content);

    console.log("Assistant:", response.content);

    res.json({
      success: true,
      response: response.content,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/*
GET /history
*/
export function history(req, res) {
  res.json({
    success: true,
    history: getHistory(),
  });
}

/*
POST /clear-history
*/
export function clear(req, res) {
  clearHistory();

  res.json({
    success: true,
    message: "Conversation history cleared.",
  });
}

/*
GET /health
*/
export function health(req, res) {
  res.json({
    success: true,
    status: "Running",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
}
