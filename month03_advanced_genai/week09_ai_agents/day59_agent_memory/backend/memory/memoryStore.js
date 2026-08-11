const conversations = new Map();

/**
 * Get all messages for a session.
 *
 * @param {string} sessionId
 * @returns {Array}
 */
export function getConversation(sessionId) {
  return conversations.get(sessionId) || [];
}

/**
 * Save the complete conversation for a session.
 *
 * @param {string} sessionId
 * @param {Array} messages
 */
export function saveConversation(sessionId, messages) {
  conversations.set(sessionId, messages);
}

/**
 * Delete a conversation.
 *
 * @param {string} sessionId
 */
export function clearConversation(sessionId) {
  conversations.delete(sessionId);
}

/**
 * Check whether a session exists.
 *
 * @param {string} sessionId
 * @returns {boolean}
 */
export function hasConversation(sessionId) {
  return conversations.has(sessionId);
}

/**
 * Clear every conversation.
 *
 * Mainly useful for testing.
 */
export function clearAllConversations() {
  conversations.clear();
}

/**
 * Return number of active sessions.
 */
export function getSessionCount() {
  return conversations.size;
}
