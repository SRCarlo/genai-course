import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadDataset } from "./dataset.js";
import { calculateMetrics } from "./metrics.js";
import { runAgent } from "../agent/agent.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

const cases = await loadDataset(
  path.join(root, "dataset/evaluation.json")
);

const results = [];

for (const testCase of cases) {
  const started = Date.now();
  const response = await runAgent({
    input: testCase.input,
    role: testCase.role || "user",
    customerId: testCase.customerId || "CUST-001",
    sessionId: `eval-${testCase.id}`
  });

  const actualTool = response.trace.spans.find((span) =>
    span.name.startsWith("tool.")
  )?.name.replace("tool.", "");

  const pass = actualTool === testCase.expectedTool;

  results.push({
    id: testCase.id,
    pass,
    expectedTool: testCase.expectedTool,
    actualTool,
    latencyMs: Date.now() - started
  });
}

const metrics = calculateMetrics(results);

console.log("\n=====================================");
console.log("       PRODUCTION AGENT EVAL");
console.log("=====================================");
console.log(`Total Cases:       ${metrics.totalCases}`);
console.log(`Passed:            ${metrics.passed}`);
console.log(`Failed:            ${metrics.failed}`);
console.log(`Task Success:      ${metrics.successRate}%`);
console.log(`Average Latency:   ${metrics.averageLatencyMs}ms`);
console.log("=====================================\n");

for (const result of results) {
  console.log(
    `${result.pass ? "PASS" : "FAIL"} ${result.id} | expected=${result.expectedTool} actual=${result.actualTool}`
  );
}
