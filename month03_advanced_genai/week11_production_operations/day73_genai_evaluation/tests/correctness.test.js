import { exactMatch, exactMatchScore } from "../src/evaluation/correctness.js";

describe("Correctness Evaluation", () => {
  test("returns true for exact matching answers", () => {
    const result = exactMatch("Node.js is a runtime.", "Node.js is a runtime.");

    expect(result).toBe(true);
  });

  test("ignores case differences", () => {
    const result = exactMatch("Node.js is a Runtime.", "node.js is a runtime.");

    expect(result).toBe(true);
  });

  test("ignores surrounding whitespace", () => {
    const result = exactMatch(
      "  Node.js is a runtime. ",
      "Node.js is a runtime.",
    );

    expect(result).toBe(true);
  });

  test("returns false for different answers", () => {
    const result = exactMatch(
      "Node.js is a runtime.",
      "Python is a programming language.",
    );

    expect(result).toBe(false);
  });

  test("returns 1 for exact match", () => {
    const result = exactMatchScore(
      "Node.js is a runtime.",
      "Node.js is a runtime.",
    );

    expect(result).toBe(1);
  });

  test("returns 0 for mismatch", () => {
    const result = exactMatchScore(
      "Node.js is a runtime.",
      "Python is a programming language.",
    );

    expect(result).toBe(0);
  });
});
