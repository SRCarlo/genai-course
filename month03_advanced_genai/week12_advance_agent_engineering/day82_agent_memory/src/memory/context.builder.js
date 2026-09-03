export function buildMemoryContext(memories) {
  if (!memories || memories.length === 0) {
    return "No relevant user memories found.";
  }

  const lines = memories.map((memory) => {
    return `- [${memory.type}] ${memory.content}`;
  });

  return ["Relevant user memories:", ...lines].join("\n");
}
