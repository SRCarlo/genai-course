const MAX_CHUNK_CHARS = 1800;

const MAX_CONTEXT_CHARS = 7000;

export function buildContext(results = []) {
  let context = "";

  for (let i = 0; i < results.length; i++) {
    const item = results[i];

    const content = String(item.content || "").slice(0, MAX_CHUNK_CHARS);

    const source = String(item.source || "unknown");

    const title = String(item.title || "Untitled");

    const block = `
SOURCE ${i + 1}

Title:
${title}

Content:
${content}

Source:
${source}
`;

    if (context.length + block.length > MAX_CONTEXT_CHARS) {
      break;
    }

    context += block;
  }

  return context.trim();
}
