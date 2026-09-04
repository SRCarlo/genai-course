export function buildMemoryContext(memories, maxCharacters = 8000) {
  if (!memories.length) {
    return "No relevant memories available.";
  }

  const lines = [];

  let currentLength = 0;

  for (let index = 0; index < memories.length; index++) {
    const memory = memories[index];

    const line = `${index + 1}. ${memory.content}`;

    if (currentLength + line.length > maxCharacters) {
      break;
    }

    lines.push(line);

    currentLength += line.length;
  }

  return lines.join("\n");
}
