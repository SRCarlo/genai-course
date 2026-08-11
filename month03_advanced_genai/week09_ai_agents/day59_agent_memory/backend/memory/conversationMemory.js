import { getMessages, addMessage } from "./memoryManager.js";

/**
 * Return conversation history.
 */
export function getConversationMessages(sessionId) {
  return getMessages(sessionId);
}

/**
 * Store user message.
 */
export function addUserMessage(sessionId, content) {
  return addMessage(sessionId, {
    role: "user",
    content,
  });
}

/**
 * Store assistant message.
 */
export function addAssistantMessage(sessionId, content) {
  return addMessage(sessionId, {
    role: "assistant",
    content,
  });
}

/**
 * Store tool result.
 */
export function addToolMessage(sessionId, toolName, content) {
  return addMessage(sessionId, {
    role: "tool",
    name: toolName,
    content,
  });
}
