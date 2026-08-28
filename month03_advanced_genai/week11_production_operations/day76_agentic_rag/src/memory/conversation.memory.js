const conversations = new Map();

export function getConversation(conversationId) {
  return conversations.get(conversationId) || [];
}

export function saveConversation(conversationId, messages) {
  conversations.set(conversationId, messages);
}

export function clearConversation(conversationId) {
  conversations.delete(conversationId);
}
