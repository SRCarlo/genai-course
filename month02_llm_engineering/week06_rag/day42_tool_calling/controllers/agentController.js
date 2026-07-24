import { handleQuestion } from "../agents/toolAgent.js";

export async function askAgent(req, res) {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        error: "Question is required",
      });
    }

    const answer = await handleQuestion(question);

    res.json({
      answer,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}
