import { startTimer, elapsedMs } from "../src/performance/timer.js";

import { ConcurrencyLimiter } from "../src/performance/concurrency.js";

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function simulatedRequest(id) {
  const start = startTimer();

  // Simulate AI request
  const processingTime = 100 + Math.floor(Math.random() * 200);

  await sleep(processingTime);

  return {
    id,
    durationMs: elapsedMs(start),
  };
}

function percentile(values, percentile) {
  const sorted = [...values].sort((a, b) => a - b);

  if (sorted.length === 0) {
    return 0;
  }

  const index = Math.ceil((percentile / 100) * sorted.length) - 1;

  return sorted[Math.max(0, index)];
}

async function runTest(requestCount, concurrencyLimit) {
  console.log(
    `\nRunning ${requestCount} requests with concurrency ${concurrencyLimit}...`,
  );

  const limiter = new ConcurrencyLimiter(concurrencyLimit);

  const start = startTimer();

  let errors = 0;

  const results = await Promise.all(
    Array.from({ length: requestCount }, (_, index) =>
      limiter.run(async () => {
        try {
          return await simulatedRequest(index + 1);
        } catch (error) {
          errors++;

          return null;
        }
      }),
    ),
  );

  const totalTime = elapsedMs(start);

  const successfulResults = results.filter(Boolean);

  const latencies = successfulResults.map((result) => result.durationMs);

  const p50 = percentile(latencies, 50);

  const p95 = percentile(latencies, 95);

  const p99 = percentile(latencies, 99);

  const throughput = successfulResults.length / (totalTime / 1000);

  const errorRate = requestCount === 0 ? 0 : errors / requestCount;

  return {
    requestCount,

    concurrencyLimit,

    totalTimeMs: Number(totalTime.toFixed(2)),

    p50Ms: Number(p50.toFixed(2)),

    p95Ms: Number(p95.toFixed(2)),

    p99Ms: Number(p99.toFixed(2)),

    throughputRps: Number(throughput.toFixed(2)),

    errorRate: Number(errorRate.toFixed(4)),
  };
}

const requestCounts = [10, 50, 100, 500];

const concurrencyLimit = 10;

console.log("________________ DAY 107 CONCURRENCY TEST ________________");

const reports = [];

for (const count of requestCounts) {
  const report = await runTest(count, concurrencyLimit);

  reports.push(report);

  console.log(report);
}

console.log("\n________________ FINAL REPORT________________");

console.table(reports);
