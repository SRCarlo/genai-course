import { weightedScore } from "../src/utils/score.js";

describe("Regression Evaluation", () => {
  test("calculates weighted score correctly", () => {
    const result = weightedScore({
      correctness: 0.9,
      relevance: 0.8,
      faithfulness: 0.95,
    });

    expect(result).toBeCloseTo(0.885);
  });

  test("detects score below threshold", () => {
    const score = weightedScore({
      correctness: 0.7,
      relevance: 0.7,
      faithfulness: 0.7,
    });

    const threshold = 0.85;

    expect(score).toBeLessThan(threshold);
  });

  test("passes a score above threshold", () => {
    const score = weightedScore({
      correctness: 0.95,
      relevance: 0.9,
      faithfulness: 0.95,
    });

    const threshold = 0.85;

    expect(score).toBeGreaterThanOrEqual(threshold);
  });
});
