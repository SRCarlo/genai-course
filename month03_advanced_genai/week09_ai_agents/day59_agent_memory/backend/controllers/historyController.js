import { getConversationMessages } from "../memory/conversationMemory.js";

export function getHistory(req, res) {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        error: "sessionId is required",
      });
    }

    const messages = getConversationMessages(sessionId);

    return res.json({
      sessionId,
      messages,
    });
  } catch (error) {
    console.error("History error:", error);

    return res.status(500).json({
      error: "Failed to get history",
    });
  }
}
