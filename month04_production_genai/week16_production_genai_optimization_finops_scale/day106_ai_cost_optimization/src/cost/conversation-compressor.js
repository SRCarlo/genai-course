export function shouldCompress({
  tokenCount,
  threshold = 6000
}) {
  return tokenCount >= threshold;
}

export function compressMessages(messages, {
  keepRecent = 4
} = {}) {
  if (!Array.isArray(messages)) {
    throw new Error("messages must be an array");
  }

  if (messages.length <= keepRecent) {
    return {
      compressed: false,
      messages,
      summary: null
    };
  }

  const oldMessages = messages.slice(0, -keepRecent);
  const recentMessages = messages.slice(-keepRecent);

  const summary = oldMessages
    .map(message => `${message.role}: ${message.content}`)
    .join("\n")
    .slice(0, 4000);

  return {
    compressed: true,
    messages: [
      {
        role: "system",
        content: `Conversation summary:\n${summary}`
      },
      ...recentMessages
    ],
    summary
  };
}