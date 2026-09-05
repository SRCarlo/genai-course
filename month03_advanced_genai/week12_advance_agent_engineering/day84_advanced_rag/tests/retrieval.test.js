import {
  embedText,
  createVocabulary,
} from "../src/embeddings/embedding.service.js";

import { vectorSearch } from "../src/retrieval/vector.search.js";

describe("Vector retrieval", () => {
  const documents = [
    {
      id: "1",
      content: "HTTP 429 means Too Many Requests.",
    },
    {
      id: "2",
      content: "JWT refresh tokens can obtain new access tokens.",
    },
  ];

  const vocabulary = createVocabulary(documents);

  const indexed = documents.map((document) => ({
    ...document,
    embedding: embedText(document.content, vocabulary),
  }));

  test("retrieves relevant document", () => {
    const results = vectorSearch("HTTP 429", indexed, vocabulary, 1);

    expect(results[0].id).toBe("1");
  });
});
