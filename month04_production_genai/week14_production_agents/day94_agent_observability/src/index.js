import "dotenv/config";
import { runAgent } from "./agent/agent.js";
import { createMetrics, getMetricsSnapshot } from "./observability/metrics.js";

const metrics = createMetrics();

const question =
  process.argv.slice(2).join(" ") ||
  "Find order 1001 and tell me its delivery date.";

try {
  const result = await runAgent(question, { metrics });

  console.log("\n=== FINAL ANSWER ===");
  console.log(result.answer);

  console.log("\n=== TRACE ===");
  console.log(JSON.stringify(result.trace, null, 2));

  console.log("\n=== METRICS ===");
  console.log(JSON.stringify(getMetricsSnapshot(metrics), null, 2));
} catch (error) {
  console.error("\nAgent execution failed:", error.message);
  process.exitCode = 1;
}
