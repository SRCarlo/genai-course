import test from "node:test";
import assert from "node:assert/strict";
import { evaluateAnswer } from "./evaluator.js";

const refundCase = {
  id: "refund-test",
  context: "Customers may request a refund within 30 days.",
  expectedAnswerContains: ["30 days"],
  shouldAbstain: false
};

test("passes when the required refund period is present", () => {
  const result = evaluateAnswer(
    refundCase,
    "Customers may request a refund within 30 days."
  );
  assert.equal(result.passed, true);
  assert.equal(result.expectedTermsPresent, true);
  assert.equal(result.abstentionCorrect, true);
});

test("fails when an unsupported answer should be declined", () => {
  const testCase = {
    id: "unknown-policy",
    context: "The policy says nothing about free repairs.",
    expectedAnswerContains: [],
    shouldAbstain: true
  };
  const result = evaluateAnswer(
    testCase,
    "Yes, lifetime free repairs are available."
  );
  assert.equal(result.passed, false);
  assert.equal(result.abstentionCorrect, false);
});

test("recognizes an abstention for an unsupported question", () => {
  const testCase = {
    id: "unknown-policy",
    context: "The policy says nothing about free repairs.",
    expectedAnswerContains: [],
    shouldAbstain: true
  };
  const result = evaluateAnswer(
    testCase,
    "The provided information does not specify this policy."
  );
  assert.equal(result.passed, true);
  assert.equal(result.abstained, true);
});

test("fails when the required phrase is missing", () => {
  const result = evaluateAnswer(refundCase, "Refunds are available after purchase.");
  assert.equal(result.passed, false);
  assert.equal(result.expectedTermsPresent, false);
});

test("rejects invalid answer input instead of crashing silently", () => {
  assert.throws(() => evaluateAnswer(refundCase, null), {
    name: "TypeError",
    message: "answer must be a string"
  });
});

test("rejects malformed evaluation cases", () => {
  assert.throws(() => evaluateAnswer({}, "answer"), {
    name: "TypeError"
  });
});
