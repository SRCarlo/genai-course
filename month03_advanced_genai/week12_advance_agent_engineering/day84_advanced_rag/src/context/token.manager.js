export function estimateTokens(text) {
  if (!text) {
    return 0;
  }

  return Math.ceil(text.length / 4);
}

export function fitDocumentsToTokenBudget(documents, maxTokens) {
  const selected = [];

  let currentTokens = 0;

  for (const document of documents) {
    const documentTokens = estimateTokens(document.content);

    if (currentTokens + documentTokens > maxTokens) {
      break;
    }

    selected.push(document);

    currentTokens += documentTokens;
  }

  return {
    documents: selected,
    estimatedTokens: currentTokens,
  };
}
