import { answerWithSecureRag } from "../../ai/rag/rag-service.js";

export async function askController(req, res) {
  try {
    const result = await answerWithSecureRag({
      user: req.user,
      question: req.question,
    });

    return res.json(result);
  } catch (error) {
    console.error("AI request failed:", error.message);

    return res.status(500).json({
      error: "AI request failed safely",
    });
  }
}
