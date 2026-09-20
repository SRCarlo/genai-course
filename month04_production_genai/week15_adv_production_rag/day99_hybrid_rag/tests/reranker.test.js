import { describe, it, expect, vi } from "vitest";
import { Reranker } from "../src/ai/retrieval/reranker.js";
describe("Reranker", () => {
  it("sorts by model relevance", async () => {
    const llmService = {
      completeJSON: vi.fn().mockResolvedValue({
        results: [
          { id: "B", score: 0.9 },
          { id: "A", score: 0.4 },
        ],
      }),
    };
    const r = new Reranker({ llmService });
    const out = await r.rerank({
      query: "HTTP 401",
      documents: [
        { id: "A", content: "A" },
        { id: "B", content: "B" },
      ],
      topN: 2,
    });
    expect(out[0].id).toBe("B");
    expect(out[0].rerankScore).toBe(0.9);
  });
});
