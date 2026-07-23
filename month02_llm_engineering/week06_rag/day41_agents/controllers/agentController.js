import { askAgent } from "../agents/basicAgent.js";

import { getMemory } from "../memory/memory.js";

export async function agentController(req, res) {
  try {
    const { question } = req.body;

    const answer = await askAgent(question);

    res.json({
      answer,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}

export function historyController(req, res) {
  res.json({
    history: getMemory(),
  });
}
