import { getUsageRecords } from "../src/services/usage.service.js";

const records = getUsageRecords();

console.log("\n____________________________________");
console.log("DAY 70 USAGE REPORT");
console.log("____________________________________\n");

if (records.length === 0) {
  console.log("No usage records found.");
  process.exit(0);
}

let totalInputTokens = 0;
let totalOutputTokens = 0;
let totalTokens = 0;
let totalCost = 0;

for (const record of records) {
  totalInputTokens += record.inputTokens;

  totalOutputTokens += record.outputTokens;

  totalTokens += record.totalTokens;

  totalCost += record.cost;

  console.log({
    requestId: record.requestId,
    userId: record.userId,
    tenantId: record.tenantId,
    model: record.model,
    inputTokens: record.inputTokens,
    outputTokens: record.outputTokens,
    totalTokens: record.totalTokens,
    cost: record.cost,
    recordedAt: record.recordedAt,
  });
}

console.log("\n____________________________________");
console.log("SUMMARY");
console.log("____________________________________");

console.log("Total input tokens:", totalInputTokens);

console.log("Total output tokens:", totalOutputTokens);

console.log("Total tokens:", totalTokens);

console.log("Estimated cost:", `$${totalCost.toFixed(8)}`);

console.log("____________________________________\n");
