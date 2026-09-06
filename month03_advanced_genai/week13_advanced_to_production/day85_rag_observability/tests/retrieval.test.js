import { describe, it, expect } from "vitest";

import { DocumentStore } from "../src/ingestion/document.store.js";

import { TfidfIndex } from "../src/retrieval/tfidf.js";

import { VectorRetriever } from "../src/retrieval/vector.retriever.js";

import { KeywordRetriever } from "../src/retrieval/keyword.retriever.js";

import { HybridRetriever } from "../src/retrieval/hybrid.retriever.js";

import { Reranker } from "../src/retrieval/reranker.js";

describe("RAG retrieval pipeline", () => {
  const store = new DocumentStore();

  const documents = store.getAll();

  const index = new TfidfIndex(documents);

  const vector = new VectorRetriever(index);

  const keyword = new KeywordRetriever(documents);

  const hybrid = new HybridRetriever({
    vectorRetriever: vector,
    keywordRetriever: keyword,
  });

  const reranker = new Reranker();

  it("finds HTTP error documentation", () => {
    const results = vector.search("What does HTTP 429 mean?", 5);

    expect(results.length).toBeGreaterThan(0);

    expect(results[0].id).toBe("http-errors.md");
  });

  it("keyword search finds HTTP errors", () => {
    const results = keyword.search("HTTP 429", 5);

    expect(results[0].id).toBe("http-errors.md");
  });

  it("hybrid search returns results", () => {
    const results = hybrid.search("JWT refresh token", 5);

    expect(results.length).toBeGreaterThan(0);
  });

  it("reranker produces rerank scores", () => {
    const results = hybrid.search("HTTP 429", 5);

    const reranked = reranker.rerank("HTTP 429", results, 3);

    expect(reranked.length).toBeGreaterThan(0);

    expect(reranked[0].rerankScore).toBeDefined();
  });
});
