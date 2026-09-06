import {
  describe,
  it,
  expect
} from "vitest";

import {
  recallAtK,
  precisionAtK,
  reciprocalRank,
  mean,
  percentile
} from "../src/evaluation/metrics.js";

describe(
  "Retrieval metrics",
  () => {
    const results = [
      { documentId: "doc1" },
      { documentId: "doc2" },
      { documentId: "doc3" },
      { documentId: "doc4" },
      { documentId: "doc5" }
    ];

    it(
      "calculates Recall@K",
      () => {
        const score =
          recallAtK(
            results,
            ["doc2", "doc4"],
            5
          );

        expect(score).toBe(1);
      }
    );

    it(
      "calculates Precision@K",
      () => {
        const score =
          precisionAtK(
            results,
            ["doc2", "doc4"],
            5
          );

        expect(score).toBe(0.4);
      }
    );

    it(
      "calculates reciprocal rank",
      () => {
        const score =
          reciprocalRank(
            results,
            ["doc3"]
          );

        expect(score).toBe(
          1 / 3
        );
      }
    );

    it(
      "returns zero when relevant result is missing",
      () => {
        const score =
          reciprocalRank(
            results,
            ["missing"]
          );

        expect(score).toBe(0);
      }
    );

    it(
      "calculates mean",
      () => {
        expect(
          mean([1, 0.5, 0])
        ).toBe(0.5);
      }
    );

    it(
      "calculates P50",
      () => {
        expect(
          percentile(
            [10, 20, 30, 40, 50],
            50
          )
        ).toBe(30);
      }
    );
  }
);