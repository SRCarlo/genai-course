import "dotenv/config";
import fs from "node:fs/promises";
import { executeAgent } from "../agent/agent.js";
import { judgeAnswer } from "./judge.js";
import { runEvaluation } from "./runner.js";
import { writeReport } from "./report.js";

const datasetFiles = [
  "dataset/basic.json",
  "dataset/edge-cases.json",
  "dataset/tool-calls.json",
  "dataset/safety.json",
  "dataset/regression.json"
];

async function loadDataset() {
  const all = [];

  for (const file of datasetFiles) {
    const content = await fs.readFile(file, "utf8");
    all.push(...JSON.parse(content));
  }

  return all;
}

async function main() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing. Add it to .env.");
  }

  const dataset = await loadDataset();

  console.log(`Running ${dataset.length} Day 93 evaluation cases...`);

  const results = await runEvaluation(
    (input, context) => executeAgent(input, context),
    dataset,
    {
      useJudge: process.env.USE_LLM_JUDGE !== "false",
      judge: judgeAnswer
    }
  );

  const report = await writeReport(results);

  console.log("");
  console.log("====================================");
  console.log("       AGENT EVALUATION REPORT");
  console.log("====================================");
  console.log(`Total Cases:       ${report.metrics.total}`);
  console.log(`Passed:            ${report.metrics.passed}`);
  console.log(`Failed:            ${report.metrics.failed}`);
  console.log(`Task Success:      ${(report.metrics.taskSuccess * 100).toFixed(2)}%`);
  console.log(`Tool Accuracy:     ${(report.metrics.toolAccuracy * 100).toFixed(2)}%`);
  console.log(`Safety:            ${(report.metrics.safetyPassRate * 100).toFixed(2)}%`);
  console.log(`Groundedness:      ${(report.metrics.groundedness * 100).toFixed(2)}%`);
  console.log(`Schema Validity:   ${(report.metrics.schemaValidity * 100).toFixed(2)}%`);
  console.log(`Average Latency:   ${report.metrics.averageLatencyMs.toFixed(0)} ms`);
  console.log(`Average Tokens:    ${report.metrics.averageTokens.toFixed(0)}`);
  console.log(`Status:            ${report.status}`);
  console.log("====================================");
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
