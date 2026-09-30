import { runLoad } from "./utils.js";

const END_AT = Date.now() + 2 * 60 * 1000;
const reports = [];

while (Date.now() < END_AT) {
  const report = await runLoad({
    totalRequests: 100,
    concurrency: 20
  });

  reports.push({
    time: new Date().toISOString(),
    rps: report.rps,
    average: report.average,
    p95: report.p95,
    p99: report.p99,
    errors: report.failed
  });

  console.table(reports.at(-1));
}

console.log("DAY 109 ENDURANCE TEST COMPLETE");
