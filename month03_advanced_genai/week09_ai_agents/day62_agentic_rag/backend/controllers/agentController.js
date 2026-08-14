import { runAgenticRagAgent } from "../agent/react/agenticRagAgent.js";

export async function runAgenticRag(req, res) {
  try {
    const { question, sessionId } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        error: "question is required",
      });
    }

    const result = await runAgenticRagAgent({
      question,
      sessionId,
    });

    return res.json({
      answer: result.answer,

      sources: result.sources || [],

      iterations: result.iterations || 0,

      toolCalls: result.toolCalls || 0,

      ragCalls: result.ragCalls || 0,

      status: result.status || "completed",
    });
  } catch (error) {
    console.error("Agent execution error:", error);

    return res.status(500).json({
      error: "Agent execution failed",
      message: error.message,
    });
  }
}
