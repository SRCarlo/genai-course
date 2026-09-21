import test from "node:test";
import assert from "node:assert/strict";
import {
  recallAtK,
  precisionAtK,
  reciprocalRank,
} from "../evaluation/retrieval.metrics.js";
import { calculateKeywordCoverage } from "../evaluation/answer.metrics.js";

test("Recall@K detects a relevant document", () => {
  assert.equal(recallAtK(["a", "b", "c"], ["b"], 3), 1);
});

test("Precision@K calculates relevant fraction", () => {
  assert.equal(precisionAtK(["a", "b", "c"], ["b"], 3), 1 / 3);
});

test("MRR returns reciprocal first relevant rank", () => {
  assert.equal(reciprocalRank(["x", "y", "b"], ["b"]), 1 / 3);
});

test("Keyword coverage calculates topic coverage", () => {
  assert.equal(
    calculateKeywordCoverage("Use Settings to reset your password.", [
      "settings",
      "password",
      "reset",
    ]),
    1,
  );
});
