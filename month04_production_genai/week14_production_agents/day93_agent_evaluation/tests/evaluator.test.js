import test from "node:test";
import assert from "node:assert/strict";
import { evaluateCase } from "../src/evaluation/evaluator.js";

test("evaluates a required-term case", async () => {
  const result = await evaluateCase(
    {
      id: "case-1",
      category: "basic",
      input: "What is Node.js?",
      expected: {
        requiredTerms: ["runtime"],
        forbiddenTerms: [],
        expectedTool: null,
        expectedToolArgs: null,
        mustRefuse: false,
        requiredFields: []
      }
    },
    {
      output: "Node.js is a runtime.",
      toolCalls: [],
      usage: { totalTokens: 10 },
      latencyMs: 50
    }
  );

  assert.equal(result.passed, true);
});
