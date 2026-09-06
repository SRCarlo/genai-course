import { tokenize } from "./tokenizer.js";

export class KeywordRetriever {
  constructor(documents) {
    this.documents = documents;
  }

  search(query, limit = 10) {
    const queryTokens = new Set(
      tokenize(query)
    );

    const results = this.documents.map(
      (document) => {
        const documentTokens = tokenize(
          `${document.title} ${document.content}`
        );

        let matches = 0;

        for (const token of documentTokens) {
          if (queryTokens.has(token)) {
            matches += 1;
          }
        }

        const uniqueMatches = new Set(
          documentTokens.filter((token) =>
            queryTokens.has(token)
          )
        ).size;

        return {
          ...document,
          score: uniqueMatches,
          rawMatches: matches,
          retrievalMethod: "keyword"
        };
      }
    );

    return results
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}