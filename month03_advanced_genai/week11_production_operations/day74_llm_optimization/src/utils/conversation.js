export function optimizeConversationHistory({
  messages = [],
  recentCount = 6,
  summary = "",
}) {
  const recentMessages = messages.slice(-recentCount);

  return {
    summary,
    recentMessages,
    totalOriginalMessages: messages.length,
    messagesSentToModel: recentMessages.length,
    removedMessages: Math.max(0, messages.length - recentMessages.length),
  };
}
