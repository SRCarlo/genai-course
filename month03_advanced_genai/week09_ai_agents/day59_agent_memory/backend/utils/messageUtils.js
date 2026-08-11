/**
 * Validate a message.
 */
export function validateMessage(message) {
  return typeof message === "string" && message.trim().length > 0;
}

/**
 * Normalize a message.
 */
export function normalizeMessage(message) {
  return message.trim();
}

/**
 * Remove fields that should not be sent
 * directly to the model.
 */
export function sanitizeMessages(messages) {
  return messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
}
