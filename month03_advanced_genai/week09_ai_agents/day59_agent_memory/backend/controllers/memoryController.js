import { clearMemory } from "../memory/memoryManager.js";

export function clearChatMemory(req, res) {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        error: "sessionId is required",
      });
    }

    clearMemory(sessionId);

    return res.json({
      sessionId,
      message: "Conversation memory cleared successfully.",
    });
  } catch (error) {
    console.error("Clear memory error:", error);

    return res.status(500).json({
      error: "Failed to clear memory",
    });
  }
}
