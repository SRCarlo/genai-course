import { runAgent } from "../agent/agent.js";

export async function chatWithAgent(req, res) {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,

        error: "message must be a non-empty string",
      });
    }

    const result = await runAgent(message);

    return res.json({
      success: true,

      answer: result.answer,

      trace: result.trace,
    });
  } catch (error) {
    console.error("Agent error:", error);

    return res.status(500).json({
      success: false,

      error: "Agent execution failed",

      message: error.message,
    });
  }
}
