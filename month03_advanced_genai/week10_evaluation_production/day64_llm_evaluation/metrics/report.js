import fs from "node:fs/promises";
import path from "node:path";

import { calculateMetrics } from "./metrics.js";

export function evaluateThresholds(metrics) {
  const thresholds = {
    correctness: Number(process.env.CORRECTNESS_THRESHOLD || 0.9),

    relevance: Number(process.env.RELEVANCE_THRESHOLD || 0.9),

    faithfulness: Number(process.env.FAITHFULNESS_THRESHOLD || 0.95),

    retrievalRecall: Number(process.env.RETRIEVAL_RECALL_THRESHOLD || 0.9),
  };

  const checks = {
    correctness: metrics.correctness >= thresholds.correctness,

    relevance: metrics.relevance >= thresholds.relevance,

    faithfulness: metrics.faithfulness >= thresholds.faithfulness,

    retrievalRecall: metrics.retrievalRecall >= thresholds.retrievalRecall,
  };

  const passed = Object.values(checks).every(Boolean);

  return {
    passed,
    thresholds,
    checks,
  };
}

export async function generateReport({ results, version = "v1" }) {
  const metrics = calculateMetrics(results);

  const qualityGate = evaluateThresholds(metrics);

  const failedTests = results.filter((result) => !result.passed);

  const report = {
    generatedAt: new Date().toISOString(),

    version,

    totalTests: results.length,

    passed: results.filter((result) => result.passed).length,

    failed: failedTests.length,

    metrics,

    qualityGate,

    failures: failedTests.map((result) => ({
      id: result.id,
      question: result.question,
      expected: result.expectedAnswer,
      actual: result.actualAnswer,
      reason:
        result.answerEvaluation?.reason ||
        result.failureReason ||
        "Evaluation failed.",
      retrievedContext: result.retrieved,
      toolCalls: result.agentEvaluation?.actualTools || [],
      latencyMs: result.latencyMs,
    })),

    results,
  };

  const outputPath = path.resolve("results", `evaluation-${version}.json`);

  await fs.mkdir(path.dirname(outputPath), {
    recursive: true,
  });

  await fs.writeFile(outputPath, JSON.stringify(report, null, 2));

  return report;
}
