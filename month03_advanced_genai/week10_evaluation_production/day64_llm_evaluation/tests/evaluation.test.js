import test from "node:test";
import assert from "node:assert/strict";

import {
  evaluateRetrieval,
  evaluateTopK,
} from "../evaluator/retrievalEvaluator.js";

import { evaluateAgent } from "../evaluator/agentEvaluator.js";

import {
  calculateAverage,
  percentile,
  calculateMetrics,
} from "../metrics/metrics.js";

test("retrieval precision and recall", () => {
  const result = evaluateRetrieval(
    [
      {
        source: "refund-policy.txt",
      },
      {
        source: "bonus-policy.txt",
      },
      {
        source: "leave-policy.txt",
      },
      {
        source: "company-policy.txt",
      },
    ],
    "refund-policy.txt",
  );

  assert.equal(result.precision, 0.25);

  assert.equal(result.recall, 1);
});

test("retrieval failure has zero recall", () => {
  const result = evaluateRetrieval(
    [
      {
        source: "bonus-policy.txt",
      },
    ],
    "refund-policy.txt",
  );

  assert.equal(result.recall, 0);
});

test("top-k retrieval", () => {
  const result = evaluateTopK(
    [
      {
        source: "bonus-policy.txt",
      },
      {
        source: "leave-policy.txt",
      },
      {
        source: "refund-policy.txt",
      },
    ],
    "refund-policy.txt",
  );

  assert.equal(result.top1, 0);

  assert.equal(result.top3, 1);
});

test("agent tool sequence", () => {
  const result = evaluateAgent({
    expectedTools: ["knowledge_search", "calculator"],

    actualTools: ["knowledge_search", "calculator"],
  });

  assert.equal(result.toolSelectionCorrect, 1);

  assert.equal(result.trajectoryCorrect, 1);
});

test("agent detects incorrect tools", () => {
  const result = evaluateAgent({
    expectedTools: ["knowledge_search", "calculator"],

    actualTools: ["calculator"],
  });

  assert.equal(result.toolSelectionCorrect, 0);
});

test("average calculation", () => {
  assert.equal(calculateAverage([1, 0.5, 1]), 0.8333333333333334);
});

test("percentile calculation", () => {
  const result = percentile([100, 200, 300, 400, 500], 50);

  assert.equal(result, 300);
});

test("metrics calculation", () => {
  const metrics = calculateMetrics([
    {
      latencyMs: 100,

      usage: {
        totalTokens: 500,
      },

      answerEvaluation: {
        correctness: 1,
        relevance: 1,
        faithfulness: 1,
      },

      retrievalEvaluation: {
        precision: 1,
        recall: 1,
        reciprocalRank: 1,
      },

      topK: {
        top1: 1,
        top3: 1,
        top5: 1,
      },

      agentEvaluation: {
        toolSelectionCorrect: 1,
        trajectoryCorrect: 1,
        toolEfficiency: 1,
        actualTools: ["knowledge_search"],
      },
    },
  ]);

  assert.equal(metrics.correctness, 1);

  assert.equal(metrics.retrievalRecall, 1);

  assert.equal(metrics.p50LatencyMs, 100);
});
