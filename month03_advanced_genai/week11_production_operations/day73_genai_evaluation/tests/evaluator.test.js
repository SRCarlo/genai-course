import {
  evaluateRetrieval,
} from "../src/evaluation/evaluator.js";

describe("Retrieval Evaluation", () => {
  test("calculates precision correctly", () => {
    const result = evaluateRetrieval({
      retrievedDocuments: [
        "D1",
        "D2",
        "D3",
        "D4",
        "D5",
      ],

      relevantDocuments: [
        "D1",
        "D2",
        "D3",
        "D6",
      ],
    });

    expect(result.precision).toBeCloseTo(0.6);
  });

  test("calculates recall correctly", () => {
    const result = evaluateRetrieval({
      retrievedDocuments: [
        "D1",
        "D2",
        "D3",
      ],

      relevantDocuments: [
        "D1",
        "D2",
        "D3",
        "D4",
        "D5",
      ],
    });

    expect(result.recall).toBeCloseTo(0.6);
  });

  test("calculates hit rate", () => {
    const result = evaluateRetrieval({
      retrievedDocuments: [
        "D1",
        "D2",
        "D3",
      ],

      relevantDocuments: [
        "D3",
      ],
    });

    expect(result.hitRate).toBe(1);
  });

  test("calculates MRR", () => {
    const result = evaluateRetrieval({
      retrievedDocuments: [
        "D9",
        "D8",
        "D3",
      ],

      relevantDocuments: [
        "D3",
      ],
    });

    expect(result.reciprocalRank)
      .toBeCloseTo(1 / 3);
  });

  test("returns zero when nothing is retrieved", () => {
    const result = evaluateRetrieval({
      retrievedDocuments: [],

      relevantDocuments: [
        "D1",
        "D2",
      ],
    });

    expect(result.precision).toBe(0);
    expect(result.recall).toBe(0);
    expect(result.hitRate).toBe(0);
    expect(result.reciprocalRank).toBe(0);
  });
});
