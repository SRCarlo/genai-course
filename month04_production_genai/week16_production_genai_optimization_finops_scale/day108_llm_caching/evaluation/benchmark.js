import { performance } from "node:perf_hooks";
import "dotenv/config";

import { CacheService } from "../src/cache/cache-service.js";
import { createCacheKey } from "../src/cache/cache-key.js";
import { RequestDeduplicator } from "../src/cache/request-dedup.js";
import { LLMService } from "../src/llm/llm-service.js";

const TOTAL_REQUESTS = 1000;
const UNIQUE_QUESTIONS = 100;

const COST_PER_LLM_CALL = 0.01;

const questions = Array.from(
  { length: UNIQUE_QUESTIONS },
  (_, index) =>
    `What is production GenAI optimization concept ${index + 1}?`
);

const llm = new LLMService();

function percentile(values, percentile) {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort(
    (a, b) => a - b
  );

  const index = Math.ceil(
    (percentile / 100) * sorted.length
  ) - 1;

  return sorted[Math.max(0, index)];
}

async function generateResponse(query) {
  const result = await llm.generate({
    messages: [
      {
        role: "system",
        content:
          "You are a helpful AI assistant."
      },
      {
        role: "user",
        content: query
      }
    ],
    temperature: 0.2
  });

  return result.response;
}

async function runNoCache() {
  const latencies = [];
  let llmCalls = 0;

  const start = performance.now();

  for (let i = 0; i < TOTAL_REQUESTS; i++) {
    const query =
      questions[i % UNIQUE_QUESTIONS];

    const requestStart = performance.now();

    await generateResponse(query);

    llmCalls++;

    latencies.push(
      performance.now() - requestStart
    );
  }

  const totalLatency =
    performance.now() - start;

  return {
    strategy: "no-cache",
    totalRequests: TOTAL_REQUESTS,
    llmCalls,
    cacheHits: 0,
    cacheMisses: TOTAL_REQUESTS,
    cacheHitRate: 0,
    totalLatencyMs: Number(
      totalLatency.toFixed(2)
    ),
    p50LatencyMs: Number(
      percentile(latencies, 50).toFixed(2)
    ),
    p95LatencyMs: Number(
      percentile(latencies, 95).toFixed(2)
    ),
    estimatedCost: Number(
      (llmCalls * COST_PER_LLM_CALL).toFixed(2)
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
      model: llm.model,
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

      const response =
        await generateResponse(query);

      llmCalls++;

      cache.set(key, {
        response
      });
    }

    latencies.push(
      performance.now() - requestStart
    );
  }

  const totalLatency =
    performance.now() - start;

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
      totalLatency.toFixed(2)
    ),
    p50LatencyMs: Number(
      percentile(latencies, 50).toFixed(2)
    ),
    p95LatencyMs: Number(
      percentile(latencies, 95).toFixed(2)
    ),
    estimatedCost: Number(
      (llmCalls * COST_PER_LLM_CALL).toFixed(2)
    )
  };
}

async function runDedupCache() {
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
    (_, index) => {
      const query =
        questions[index % UNIQUE_QUESTIONS];

      const key = createCacheKey({
        tenantId: "benchmark",
        userId: "benchmark-user",
        model: llm.model,
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

        const response =
          await generateResponse(query);

        llmCalls++;

        cache.set(key, {
          response
        });

        return response;
      });
    }
  );

  await Promise.all(requests);

  const totalLatency =
    performance.now() - start;

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
      totalLatency.toFixed(2)
    ),
    p50LatencyMs: null,
    p95LatencyMs: null,
    estimatedCost: Number(
      (llmCalls * COST_PER_LLM_CALL).toFixed(2)
    )
  };
}

console.log("=================================");
console.log("DAY 108 - CACHE BENCHMARK");
console.log("=================================");
console.log("");

console.log(
  `Requests: ${TOTAL_REQUESTS}`
);

console.log(
  `Unique questions: ${UNIQUE_QUESTIONS}`
);

console.log("");

console.log(
  "Running exact-cache benchmark..."
);

const exactCache =
  await runExactCache();

console.log(
  "Exact-cache benchmark complete."
);

console.log("");

console.log(
  "Running deduplicated-cache benchmark..."
);

const dedupCache =
  await runDedupCache();

console.log(
  "Deduplicated-cache benchmark complete."
);

console.log("");

console.log("RESULTS");
console.log(
  JSON.stringify(
    {
      exactCache,
      dedupCache
    },
    null,
    2
  )
);

console.log("");

console.log("NOTE:");
console.log(
  "The no-cache strategy is intentionally not executed by default because it would make 1000 real Groq API calls."
);