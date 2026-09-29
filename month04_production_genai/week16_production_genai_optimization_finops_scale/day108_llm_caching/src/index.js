import "dotenv/config";

import { CacheService } from "./cache/cache-service.js";
import { createCacheKey } from "./cache/cache-key.js";
import { RequestDeduplicator } from "./cache/request-dedup.js";
import { CacheMetrics } from "./metrics/cache-metrics.js";
import { LLMService } from "./llm/llm-service.js";
import { SemanticCache } from "./cache/semantic-cache.js";
import { createVersionedKey } from "./cache/invalidation.js";

async function main() {
  console.log("\n=================================");
  console.log("DAY 108 - LLM CACHING");
  console.log("=================================\n");

  if (!process.env.GROQ_API_KEY) {
    console.error("ERROR: GROQ_API_KEY is missing.");
    console.error("Copy .env.example to .env and add your Groq key.");
    process.exit(1);
  }

  const cache = new CacheService({ maxEntries: 1000 });
  const metrics = new CacheMetrics();
  const deduplicator = new RequestDeduplicator();

  const llm = new LLMService(
    cache,
    metrics,
    deduplicator
  );

  const model =
    process.env.GROQ_MODEL || "openai/gpt-oss-20b";

  const query = "What is caching in AI?";

  const key = createCacheKey({
    tenantId: "tenant-1",
    model,
    promptVersion: "v1",
    contextVersion: "v1",
    query,
    temperature: 0.2,
    language: "en"
  });

  const messages = [
    {
      role: "system",
      content:
        "You are a concise AI engineering tutor."
    },
    {
      role: "user",
      content:
        "Explain caching in AI in 3 short points."
    }
  ];

  console.time("First request");

  const first = await llm.generate({
    key,
    messages,
    ttlMs: 300_000
  });

  console.timeEnd("First request");

  console.log("\nFirst result:");
  console.log(first);

  console.time("Second request");

  const second = await llm.generate({
    key,
    messages,
    ttlMs: 300_000
  });

  console.timeEnd("Second request");

  console.log("\nSecond result:");
  console.log(second);

  console.log("\nCache metrics:");
  console.log(metrics.getStats());

  console.log("\nVersioned keys:");
  console.log(createVersionedKey("faq", "v1", "abc123"));
  console.log(createVersionedKey("faq", "v2", "abc123"));

  const semanticCache = new SemanticCache({
    threshold: 0.5
  });

  semanticCache.set({
    query: "What is your refund policy?",
    response:
      "Eligible refunds are processed according to the refund policy.",
    tenantId: "tenant-1",
    contextVersion: "v1"
  });

  const semanticResult = semanticCache.get({
    query: "Can I get a refund?",
    tenantId: "tenant-1",
    contextVersion: "v1"
  });

  console.log("\nSemantic cache result:");
  console.log(semanticResult);

  console.log("\n=================================");
  console.log("DAY 108 DEMO COMPLETE");
  console.log("=================================\n");
}

main().catch(error => {
  console.error("\nApplication error:");
  console.error(error);
  process.exit(1);
});