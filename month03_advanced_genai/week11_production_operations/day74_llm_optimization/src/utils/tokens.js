export function estimateTokens(text = "") {
  if (!text) {
    return 0;
  }

  const words = text.trim().split(/\s+/).length;

  // Rough approximation.
  return Math.ceil(words * 1.3);
}

export function estimateConversationTokens(messages = []) {
  return messages.reduce((total, message) => {
    return total + estimateTokens(message.content || "");
  }, 0);
}
