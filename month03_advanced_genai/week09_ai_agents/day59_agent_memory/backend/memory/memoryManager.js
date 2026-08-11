import {
  getConversation,
  saveConversation,
  clearConversation,
} from "./memoryStore.js";

const MAX_MESSAGES = Number(process.env.MAX_MESSAGES) || 10;

export function getMessages(sessionId) {
  return getConversation(sessionId);
}

export function addMessage(sessionId, message) {
  const messages = getConversation(sessionId);

  messages.push(message);

  const trimmedMessages = messages.slice(-MAX_MESSAGES);

  saveConversation(sessionId, trimmedMessages);
}

export function clearMemory(sessionId) {
  clearConversation(sessionId);
}
