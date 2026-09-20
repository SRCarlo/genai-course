import { chatService } from "../../application/chat.service.js";
export async function chatController(req, res, next) {
  try {
    const { question, conversation = [] } = req.body;
    if (!question || typeof question !== "string" || !question.trim())
      return res
        .status(400)
        .json({ success: false, message: "question is required" });
    const result = await chatService.ask({
      question: question.trim(),
      conversation,
    });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}
