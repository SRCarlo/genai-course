import { performance } from "node:perf_hooks";

import { CacheService } from "../src/cache/cache-service.js";
import { createCacheKey } from "../src/cache/cache-key.js";
import { RequestDeduplicator } from "../src/cache/request-dedup.js";

const TOTAL_REQUESTS = 1000;
const UNIQUE_QUESTIONS = 100;

const MOCK_LLM_LATENCY_MS = 20;
const MOCK_COST_PER_CALL = 0.01;

const questions = Array.from(
  { length: UNIQUE_QUESTIONS },
  (_, index) =>
    `What is production GenAI optimization concept ${index + 1}?`
);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function mockLLM(query) {
  await sleep(MOCK_LLM_LATENCY_MS);

  return `Mock response for: ${query}`;
}

function percentile(values, percentileValue) {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort(
    (a, b) => a - b
  );

  const index = Math.ceil(
    (percentileValue / 100) * sorted.length
  ) - 1;

  return sorted[Math.max(0, index)];
}

async function runNoCache() {
  const latencies = [];
  let llmCalls = 0;

  const start = performance.now();

  for (let i = 0; i < TOTAL_REQUESTS; i++) {
    const query =
      questions[i % UNIQUE_QUESTIONS];

    const requestStart = performance.now();

    await mockLLM(query);

    llmCalls++;

    latencies.push(
      performance.now() - requestStart
    );
  }

  return {
    strategy: "no-cache",
    totalRequests: TOTAL_REQUESTS,
    llmCalls,
    cacheHits: 0,
    cacheMisses: TOTAL_REQUESTS,
    cacheHitRate: 0,
    totalLatencyMs: Number(
      (performance.now() - start).toFixed(2)
    ),
    p50LatencyMs: Number(
      percentile(latencies, 50).toFixed(2)
    ),
    p95LatencyMs: Number(
      percentile(latencies, 95).toFixed(2)
    ),
    estimatedCost: Number(
      (llmCalls * MOCK_COST_PER_CALL).toFixed(2)
    )
  };
}

async function runExactCache() {
  const cache = new CacheService({
    maxEntries: 1000,
    ttlMs: 5 * 60 * 1000
  });

  const latencies = [];

  let llmCalls = 0;
  let cacheHits = 0;
  let cacheMisses = 0;

  const start = performance.now();

  for (let i = 0; i < TOTAL_REQUESTS; i++) {
    const query =
      questions[i % UNIQUE_QUESTIONS];

    const key = createCacheKey({
      tenantId: "benchmark",
      userId: "benchmark-user",
      model: "mock-model",
      promptVersion: "v1",
      contextVersion: "v1",
      query,
      temperature: 0.2,
      language: "en"
    });

    const requestStart = performance.now();

    const cached = cache.get(key);

    if (cached) {
      cacheHits++;
    } else {
      cacheMisses++;

      const response = await mockLLM(query);

      llmCalls++;

      cache.set(key, {
        response
      });
    }

    latencies.push(
      performance.now() - requestStart
    );
  }

  return {
    strategy: "exact-cache",
    totalRequests: TOTAL_REQUESTS,
    llmCalls,
    cacheHits,
    cacheMisses,
    cacheHitRate: Number(
      (cacheHits / TOTAL_REQUESTS).toFixed(4)
    ),
    totalLatencyMs: Number(
      (performance.now() - start).toFixed(2)
    ),
    p50LatencyMs: Number(
      percentile(latencies, 50).toFixed(2)
    ),
    p95LatencyMs: Number(
      percentile(latencies, 95).toFixed(2)
    ),
    estimatedCost: Number(
      (llmCalls * MOCK_COST_PER_CALL).toFixed(2)
    )
  };
}

async function runDeduplicatedCache() {
  const cache = new CacheService({
    maxEntries: 1000,
    ttlMs: 5 * 60 * 1000
  });

  const dedup = new RequestDeduplicator();

  let llmCalls = 0;
  let cacheHits = 0;
  let cacheMisses = 0;

  const start = performance.now();

  const requests = Array.from(
    { length: TOTAL_REQUESTS },
    (_, i) => {
      const query =
        questions[i % UNIQUE_QUESTIONS];

      const key = createCacheKey({
        tenantId: "benchmark",
        userId: "benchmark-user",
        model: "mock-model",
        promptVersion: "v1",
        contextVersion: "v1",
        query,
        temperature: 0.2,
        language: "en"
      });

      return dedup.execute(key, async () => {
        const cached = cache.get(key);

        if (cached) {
          cacheHits++;

          return cached.response;
        }

        cacheMisses++;

        const response = await mockLLM(query);

        llmCalls++;

        cache.set(key, {
          response
        });

        return response;
      });
    }
  );

  await Promise.all(requests);

  return {
    strategy: "deduplicated-cache",
    totalRequests: TOTAL_REQUESTS,
    llmCalls,
    cacheHits,
    cacheMisses,
    cacheHitRate: Number(
      (cacheHits / TOTAL_REQUESTS).toFixed(4)
    ),
    totalLatencyMs: Number(
      (performance.now() - start).toFixed(2)
    ),
    p50LatencyMs: null,
    p95LatencyMs: null,
    estimatedCost: Number(
      (llmCalls * MOCK_COST_PER_CALL).toFixed(2)
    )
  };
}

console.log("=================================");
console.log("DAY 108 - MOCK CACHE BENCHMARK");
console.log("=================================");
console.log("");

console.log(`Total requests: ${TOTAL_REQUESTS}`);
console.log(`Unique questions: ${UNIQUE_QUESTIONS}`);
console.log(
  `Mock LLM latency: ${MOCK_LLM_LATENCY_MS}ms`
);
console.log("");

console.log("Running no-cache...");
const noCache = await runNoCache();

console.log("Running exact-cache...");
const exactCache = await runExactCache();

console.log("Running deduplicated-cache...");
const deduplicatedCache =
  await runDeduplicatedCache();

console.log("");
console.log("=================================");
console.log("BENCHMARK RESULTS");
console.log("=================================");

console.table([
  noCache,
  exactCache,
  deduplicatedCache
]);

console.log("");
console.log("Detailed JSON:");
console.log(
  JSON.stringify(
    {
      noCache,
      exactCache,
      deduplicatedCache
    },
    null,
    2
  )
);