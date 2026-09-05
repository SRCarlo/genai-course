import { rerank } from "../src/reranking/reranker.js";

describe("Reranking", () => {
  test("ranks more relevant document higher", () => {
    const documents = [
      {
        id: "1",
        content: "JWT generation creates a token.",
        hybridScore: 0.8,
      },
      {
        id: "2",
        content: "JWT refresh tokens obtain a new access token.",
        hybridScore: 0.8,
      },
    ];

    const results = rerank("How do I refresh a JWT?", documents, 2);

    expect(results[0].id).toBe("2");
  });
});
