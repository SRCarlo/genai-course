import { runLoad } from "./utils.js";

const stages = [
  { totalRequests: 10, concurrency: 10 },
  { totalRequests: 10, concurrency: 10 },
  { totalRequests: 10, concurrency: 10 },
  { totalRequests: 500, concurrency: 100 }
];

const results = [];

for (const stage of stages) {
  const report = await runLoad(stage);

  results.push({
    requests: report.requests,
    concurrency: stage.concurrency,
    rps: report.rps,
    p95: report.p95,
    p99: report.p99,
    errors: report.failed
  });
}

console.log("DAY 109 SPIKE TEST");
console.table(results);
