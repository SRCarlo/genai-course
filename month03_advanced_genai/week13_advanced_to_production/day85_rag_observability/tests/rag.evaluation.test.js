import { describe, it, expect } from "vitest";

import {
  evaluateContextRelevance,
  evaluateFaithfulness,
  evaluateCorrectness,
} from "../src/evaluation/answer.evaluator.js";

describe("RAG answer evaluation", () => {
  const context = `
      HTTP 429 means Too Many Requests.
      It indicates that the client has sent
      too many requests within a given period.
    `;

  it("detects relevant context", () => {
    const score = evaluateContextRelevance({
      question: "What does HTTP 429 mean?",
      context,
    });

    expect(score).toBeGreaterThan(0.5);
  });

  it("measures faithfulness", () => {
    const score = evaluateFaithfulness({
      answer: "HTTP 429 means Too Many Requests.",
      context,
    });

    expect(score).toBeGreaterThan(0.5);
  });

  it("measures answer correctness", () => {
    const score = evaluateCorrectness({
      answer: "HTTP 429 means Too Many Requests.",
      expectedAnswer: "HTTP 429 means Too Many Requests.",
    });

    expect(score).toBe(1);
  });

  it("detects a weak answer", () => {
    const score = evaluateCorrectness({
      answer: "JWT is used for authentication.",
      expectedAnswer: "HTTP 429 means Too Many Requests.",
    });

    expect(score).toBeLessThan(1);
  });
});
