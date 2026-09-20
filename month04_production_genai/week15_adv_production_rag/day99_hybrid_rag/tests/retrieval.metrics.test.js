import { describe, it, expect } from "vitest";
import {
  recallAtK,
  precisionAtK,
  reciprocalRank,
} from "../evaluation/retrieval.metrics.js";
describe("Retrieval metrics", () => {
  const r = [
    { documentId: "A" },
    { documentId: "B" },
    { documentId: "C" },
    { documentId: "D" },
  ];
  it("Recall@K", () =>
    expect(recallAtK(r, ["A", "C", "X"], 3)).toBeCloseTo(2 / 3));
  it("Precision@K", () => expect(precisionAtK(r, ["A", "C"], 4)).toBe(0.5));
  it("MRR", () => expect(reciprocalRank(r, ["C"])).toBe(1 / 3));
});
