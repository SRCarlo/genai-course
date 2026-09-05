import { compressDocuments } from "./context.compressor.js";

import { fitDocumentsToTokenBudget } from "./token.manager.js";

export function buildContext(
  documents,
  { maxDocuments = 5, maxTokens = 2500, minimumScore = 0.05 } = {},
) {
  const compressed = compressDocuments(documents, minimumScore);

  const limited = compressed.slice(0, maxDocuments);

  const budgeted = fitDocumentsToTokenBudget(limited, maxTokens);

  const context = budgeted.documents
    .map(
      (document, index) =>
        `[Source ${index + 1}]
Document: ${document.source}
Chunk: ${document.chunkIndex}
Score: ${document.rerankScore.toFixed(4)}

${document.content}`,
    )
    .join("\n\n");

  return {
    context,
    documents: budgeted.documents,
    estimatedTokens: budgeted.estimatedTokens,
  };
}
