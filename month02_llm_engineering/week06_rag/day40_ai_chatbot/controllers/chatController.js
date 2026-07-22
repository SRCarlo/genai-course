import model from "../config/groq.js";

import SYSTEM_PROMPT from "../prompts/systemPrompt.js";

import { retrieveContext } from "../rag/retriever.js";

import { addMessage, getHistory, clearHistory } from "../memory/chatMemory.js";

export async function chat(req, res) {
  try {
    const { message } = req.body;

    addMessage("user", message);

    const context = retrieveContext(message);

    const prompt = `

${SYSTEM_PROMPT}

Context:

${context}

Conversation:

${JSON.stringify(getHistory())}

User:

${message}

`;

    const response = await model.invoke(prompt);

    addMessage(
      "assistant",

      response.content,
    );

    res.json({
      success: true,

      response: response.content,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      error: error.message,
    });
  }
}

export function history(req, res) {
  res.json(getHistory());
}

export function clear(req, res) {
  clearHistory();

  res.json({
    success: true,

    message: "History Cleared",
  });
}

export function health(req, res) {
  res.json({
    status: "OK",

    uptime: process.uptime(),
  });
}
