export function buildLLMMessages({
  systemPrompt,
  summary,
  memories,
  state,
  messages,
  currentUserMessage,
}) {
  const memoryText = memories.length
    ? memories
        .map((memory) => `- [${memory.type}] ${memory.content}`)
        .join("\n")
    : "No relevant long-term memories.";

  const stateText = JSON.stringify(state, null, 2);

  const summaryText = summary
    ? JSON.stringify(summary, null, 2)
    : "No conversation summary.";

  const systemContent = `
${systemPrompt}

LONG-TERM MEMORY:
${memoryText}

CONVERSATION SUMMARY:
${summaryText}

CURRENT WORKING STATE:
${stateText}

Use memory only when relevant.
Do not claim a memory is true if it conflicts
with a newer explicit user statement.
`;

  return [
    {
      role: "system",
      content: systemContent,
    },

    ...messages,

    {
      role: "user",
      content: currentUserMessage,
    },
  ];
}
