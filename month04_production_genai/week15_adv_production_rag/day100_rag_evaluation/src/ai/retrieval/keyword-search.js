import { tokenize } from "./tokenizer.js";

export function keywordSearch(query, documents, topK = 5) {
  const queryTokens = new Set(tokenize(query));

  return documents
    .map((document) => {
      const docTokens = tokenize(`${document.title} ${document.text}`);
      const uniqueDocTokens = new Set(docTokens);
      let matches = 0;

      for (const token of queryTokens) {
        if (uniqueDocTokens.has(token)) matches += 1;
      }

      const score = queryTokens.size ? matches / queryTokens.size : 0;

      return {
        ...document,
        score,
        source: "keyword",
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
