import { memoryAgent } from "../agents/memoryAgent.js";

import { recall } from "../memory/memoryManager.js";

export async function save(req, res) {
  try {
    const result = await memoryAgent(req.body.message);

    res.json({
      success: true,

      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}

export async function history(req, res) {
  try {
    const messages = recall();

    res.json({
      success: true,

      history: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}
