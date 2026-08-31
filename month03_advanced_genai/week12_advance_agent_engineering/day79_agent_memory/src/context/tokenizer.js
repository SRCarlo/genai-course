export function estimateTokens(text = "") {
  if (!text) {
    return 0;
  }

  return Math.ceil(text.length / 4);
}

export function estimateMessagesTokens(messages = []) {
  return messages.reduce(
    (total, message) => total + estimateTokens(message.content || ""),
    0,
  );
}

export function estimateContextTokens({
  systemPrompt = "",
  memories = [],
  messages = [],
}) {
  const memoryText = memories.map((memory) => memory.content).join("\n");

  return (
    estimateTokens(systemPrompt) +
    estimateTokens(memoryText) +
    estimateMessagesTokens(messages)
  );
}
