import "dotenv/config";
import fs from "node:fs/promises";
import { performance } from "node:perf_hooks";
import { streamText } from "../src/llm/groq-client.js";
import { ConcurrencyLimiter } from "../src/performance/concurrency.js";

const config = JSON.parse(await fs.readFile("./evaluation/performance/benchmark-config.json", "utf8"));
const cases = JSON.parse(await fs.readFile("./evaluation/performance/test-cases.json", "utf8"));

const limiter = new ConcurrencyLimiter(config.concurrency);
const ttft = [];
const ttlt = [];
const totals = [];
let errors = 0;

function percentile(values, p) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return Number(sorted[Math.max(0, index)].toFixed(2));
}

async function oneRequest(testCase) {
  return limiter.run(async () => {
    const start = performance.now();
    let firstTokenAt = null;
    let tokenCount = 0;

    try {
      const stream = await streamText({
        messages: [
          { role: "system", content: "Answer briefly for a performance benchmark." },
          { role: "user", content: testCase.query }
        ],
        maxCompletionTokens: config.maxCompletionTokens
      });

      for await (const chunk of stream) {
        const token = chunk.choices?.[0]?.delta?.content || "";
        if (!token) continue;
        tokenCount++;
        if (firstTokenAt === null) firstTokenAt = performance.now();
      }

      const end = performance.now();
      const currentTtft = firstTokenAt === null ? end - start : firstTokenAt - start;
      const currentTtlt = end - start;

      ttft.push(currentTtft);
      ttlt.push(currentTtlt);
      totals.push(currentTtlt);

      return { ok: true, tokenCount };
    } catch (error) {
      errors++;
      return { ok: false, error: error.message };
    }
  });
}

const started = performance.now();
const jobs = Array.from({ length: config.requests }, (_, i) => oneRequest(cases[i % cases.length]));
const results = await Promise.all(jobs);
const elapsedSeconds = (performance.now() - started) / 1000;

const report = {
  timestamp: new Date().toISOString(),
  model: config.model,
  requests: config.requests,
  concurrency: config.concurrency,
  ttftMs: {
    p50: percentile(ttft, 50),
    p95: percentile(ttft, 95),
    p99: percentile(ttft, 99)
  },
  totalLatencyMs: {
    p50: percentile(totals, 50),
    p95: percentile(totals, 95),
    p99: percentile(totals, 99)
  },
  ttlTMs: {
    p50: percentile(ttlt, 50),
    p95: percentile(ttlt, 95),
    p99: percentile(ttlt, 99)
  },
  throughputRps: Number((config.requests / elapsedSeconds).toFixed(2)),
  errorRate: Number((errors / config.requests).toFixed(4)),
  successfulRequests: results.filter(r => r.ok).length,
  failedRequests: errors,
  note: "Measured values from your run; provider/network load affects results."
};

await fs.writeFile("./reports/day107-performance-report.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
