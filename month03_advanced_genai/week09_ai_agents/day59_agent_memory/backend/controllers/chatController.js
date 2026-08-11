import { getConversationMessages } from "../memory/conversationMemory.js";

import { clearMemory } from "../memory/memoryManager.js";

import { runChat } from "../agent/chatAgent.js";

import {
  createSessionId,
  isValidSessionId,
} from "../session/sessionManager.js";

import { validateMessage, normalizeMessage } from "../utils/messageUtils.js";

/**
 * POST /api/chat
 */
export async function chatController(req, res) {
  try {
    let { sessionId, message } = req.body;

    if (!validateMessage(message)) {
      return res.status(400).json({
        error: "message is required and must be a non-empty string",
      });
    }

    message = normalizeMessage(message);

    if (!isValidSessionId(sessionId)) {
      sessionId = createSessionId();
    }

    const result = await runChat(sessionId, message);

    return res.json({
      success: true,

      sessionId,

      response: result.response,

      state: {
        currentStep: result.state.currentStep,

        status: result.state.status,
      },
    });
  } catch (error) {
    console.error("Chat controller error:", error);

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

/**
 * GET /api/chat/:sessionId/history
 */
export function historyController(req, res) {
  const { sessionId } = req.params;

  if (!isValidSessionId(sessionId)) {
    return res.status(400).json({
      error: "Invalid session ID",
    });
  }

  const messages = getConversationMessages(sessionId);

  return res.json({
    success: true,
    sessionId,
    messages,
  });
}

/**
 * DELETE /api/chat/:sessionId
 */
export function clearChatController(req, res) {
  const { sessionId } = req.params;

  if (!isValidSessionId(sessionId)) {
    return res.status(400).json({
      error: "Invalid session ID",
    });
  }

  clearMemory(sessionId);

  return res.json({
    success: true,

    sessionId,

    message: "Conversation memory cleared.",
  });
}
