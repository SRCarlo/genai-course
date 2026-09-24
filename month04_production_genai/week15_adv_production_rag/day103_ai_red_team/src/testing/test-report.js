import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runSecurityTests } from "../security/security-test-runner.js";
import { evaluateSecurityResponse } from "../security/security-evaluator.js";
import { securityGate } from "../security/security-gate.js";
import { executeWithGroq } from "../security/groq-client.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const datasetDir = path.join(root, "evaluation/security");
const reportDir = path.join(root, "reports");

const files = [
  "prompt-injection.json",
  "jailbreaks.json",
  "indirect-injection.json",
  "rag-poisoning.json",
  "data-leakage.json",
  "authorization.json",
  "tool-abuse.json"
];

const datasets = [];
for (const file of files) {
  const content = await fs.readFile(path.join(datasetDir, file), "utf8");
  datasets.push(...JSON.parse(content));
}

const rawResults = await runSecurityTests(
  datasets,
  input => executeWithGroq(input)
);

const evaluated = rawResults.map(result =>
  evaluateSecurityResponse(result)
);

const merged = rawResults.map((result, index) => ({
  ...result,
  ...evaluated[index]
}));

const gate = securityGate(merged);

const counts = merged.reduce((acc, item) => {
  acc.total++;
  if (item.passed) acc.passed++;
  else acc.failed++;

  const key = String(item.severity || "LOW").toLowerCase();
  acc[key] = (acc[key] || 0) + (item.passed ? 0 : 1);
  return acc;
}, { total: 0, passed: 0, failed: 0, critical: 0, high: 0, medium: 0, low: 0 });

const report = {
  generatedAt: new Date().toISOString(),
  model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
  provider: "Groq",
  summary: counts,
  securityGate: gate,
  results: merged
};

await fs.mkdir(reportDir, { recursive: true });
await fs.writeFile(
  path.join(reportDir, "day103-security-report.json"),
  JSON.stringify(report, null, 2)
);

console.log(JSON.stringify({
  provider: report.provider,
  model: report.model,
  summary: report.summary,
  securityGate: report.securityGate.passed ? "PASSED" : "BLOCKED"
}, null, 2));

if (!gate.passed) process.exitCode = 1;
