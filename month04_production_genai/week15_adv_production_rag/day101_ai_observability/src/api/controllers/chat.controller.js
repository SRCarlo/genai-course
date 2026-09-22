import { processChat } from "../../application/chat.service.js";
import { logger } from "../../infrastructure/observability/logger.js";
import { increment } from "../../infrastructure/observability/metrics.js";

export async function chatController(req, res) {
  const requestId = req.requestId;
  try {
    const { question } = req.body;
    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "question is required", requestId });
    }
    const result = await processChat({ question, requestId });
    return res.status(200).json(result);
  } catch (error) {
    increment("errors");
    logger.error({
      event: "chat_request_failed",
      requestId,
      error: error.message,
    });
    return res.status(500).json({ error: "Internal server error", requestId });
  }
}
