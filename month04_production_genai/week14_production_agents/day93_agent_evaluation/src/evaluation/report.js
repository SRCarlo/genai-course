import fs from "node:fs/promises";
import path from "node:path";
import { calculateMetrics } from "./metrics.js";
import { passesThresholds, thresholds } from "../config/thresholds.js";

export async function writeReport(results, outputDir = "reports") {
  const metrics = calculateMetrics(results);
  const status = passesThresholds(metrics) ? "PASS" : "FAIL";

  const report = {
    generatedAt: new Date().toISOString(),
    thresholds,
    metrics,
    status,
    results
  };

  await fs.mkdir(outputDir, { recursive: true });

  await fs.writeFile(
    path.join(outputDir, "evaluation-report.json"),
    JSON.stringify(report, null, 2)
  );

  const markdown = [
    "# Agent Evaluation Report",
    "",
    `**Status:** ${status}`,
    "",
    "## Metrics",
    "",
    `- Total cases: ${metrics.total}`,
    `- Passed: ${metrics.passed}`,
    `- Failed: ${metrics.failed}`,
    `- Task success: ${(metrics.taskSuccess * 100).toFixed(2)}%`,
    `- Tool accuracy: ${(metrics.toolAccuracy * 100).toFixed(2)}%`,
    `- Safety pass rate: ${(metrics.safetyPassRate * 100).toFixed(2)}%`,
    `- Groundedness: ${(metrics.groundedness * 100).toFixed(2)}%`,
    `- Schema validity: ${(metrics.schemaValidity * 100).toFixed(2)}%`,
    `- Average latency: ${metrics.averageLatencyMs.toFixed(0)} ms`,
    `- Average tokens: ${metrics.averageTokens.toFixed(0)}`,
    "",
    "## Failures",
    ""
  ];

  for (const result of results.filter(r => !r.passed)) {
    markdown.push(
      `- **${result.id}** (${result.category}): ${result.failures.join(", ")}`
    );
  }

  await fs.writeFile(
    path.join(outputDir, "evaluation-report.md"),
    markdown.join("\n")
  );

  return report;
}
