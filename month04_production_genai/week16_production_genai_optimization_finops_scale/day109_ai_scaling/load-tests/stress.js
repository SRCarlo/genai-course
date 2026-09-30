import { runLoad } from "./utils.js";

const levels = [1, 5, 10, 20, 50, 100];
const results = [];

for (const concurrency of levels) {
  const report = await runLoad({
    totalRequests: Math.max(100, concurrency * 5),
    concurrency
  });

  results.push({
    concurrency,
    rps: report.rps,
    p95: report.p95,
    p99: report.p99,
    errors: report.failed
  });
}

console.log("DAY 109 STRESS TEST");
console.table(results);
