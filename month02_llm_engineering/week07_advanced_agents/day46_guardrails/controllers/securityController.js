import { askAI } from "../agents/secureAgent.js";
import { validateOutput } from "../guardrails/outputGuard.js";

export async function ask(req, res) {
  try {
    const { message } = req.body;

    const response = await askAI(message);

    if (!validateOutput(response)) {
      return res.status(403).json({
        success: false,
        error: "Unsafe output detected.",
      });
    }

    res.json({
      success: true,
      answer: response,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
