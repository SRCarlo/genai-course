import { runAgent } from "../agent/agentLoop.js";

export async function runAgentController(req, res) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const answer = await runAgent(message);

    return res.status(200).json({
      success: true,
      answer: String(answer),
    });
  } catch (error) {
    console.error("Application error:", error);

    return res.status(500).json({
      success: false,
      message: "Agent execution failed",
      error: error.message,
    });
  }
}
