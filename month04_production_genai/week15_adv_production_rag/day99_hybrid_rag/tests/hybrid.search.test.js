import { describe, it, expect } from "vitest";
import { reciprocalRankFusion } from "../src/ai/retrieval/rrf.js";
describe("RRF", () => {
  it("combines ranked results", () => {
    const a = [{ id: "A" }, { id: "B" }],
      b = [{ id: "B" }, { id: "C" }],
      r = reciprocalRankFusion([a, b]);
    expect(r).toHaveLength(3);
    expect(r[0].id).toBe("B");
  });
});
