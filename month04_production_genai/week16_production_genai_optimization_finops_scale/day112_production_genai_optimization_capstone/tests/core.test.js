import test from "node:test";
import assert from "node:assert/strict";
import { ResponseCache } from "../src/cache/response-cache.js";
import { RateLimiter } from "../src/rate-limit/rate-limiter.js";
import { validateGenerateRequest } from "../src/security/input-validation.js";
import { CircuitBreaker } from "../src/resilience/circuit-breaker.js";
import { retry, isRetryableError } from "../src/resilience/retry.js";
import { fallback } from "../src/resilience/fallback.js";
import { ModelRegistry } from "../src/models/model-registry.js";
import { ModelRouter } from "../src/router/model-router.js";
import { CostTracker } from "../src/cost/cost-tracker.js";

test("cache stores and expires values", async () => {
  const c = new ResponseCache(10);
  c.set("a", 1);
  assert.equal(c.get("a"), 1);
  await new Promise((r) => setTimeout(r, 15));
  assert.equal(c.get("a"), null);
});
test("rate limiter rejects after limit", () => {
  const r = new RateLimiter({ maxRequests: 2, windowMs: 1000 });
  assert.equal(r.allow("x"), true);
  assert.equal(r.allow("x"), true);
  assert.equal(r.allow("x"), false);
});
test("validation normalizes request", () => {
  assert.deepEqual(
    validateGenerateRequest({
      prompt: " hi ",
      task: "chat",
      complexity: "medium",
    }).prompt,
    "hi",
  );
});
test("validation rejects empty prompt", () => {
  assert.throws(
    () => validateGenerateRequest({ prompt: " " }),
    /prompt is required/,
  );
});
test("circuit opens after threshold", () => {
  const c = new CircuitBreaker({ failureThreshold: 2, resetTimeoutMs: 1000 });
  c.failure();
  assert.equal(c.state, "CLOSED");
  c.failure();
  assert.equal(c.state, "OPEN");
});
test("retry retries transient failures", async () => {
  let n = 0;
  const v = await retry(
    async () => {
      n++;
      if (n < 2) {
        const e = new Error("temporary");
        e.status = 503;
        throw e;
      }
      return 42;
    },
    { attempts: 2, delayMs: 1 },
  );
  assert.equal(v, 42);
});
test("non retryable error is not retried", async () => {
  let n = 0;
  await assert.rejects(
    () =>
      retry(
        async () => {
          n++;
          const e = new Error("bad request");
          e.status = 400;
          throw e;
        },
        { attempts: 3, delayMs: 1 },
      ),
    /bad request/,
  );
  assert.equal(n, 1);
});
test("retryable helper recognizes timeout", () => {
  const e = new Error("timeout");
  e.code = "ETIMEDOUT";
  assert.equal(isRetryableError(e), true);
});
test("fallback uses next operation", async () => {
  const v = await fallback([
    async () => {
      throw new Error("x");
    },
    async () => "ok",
  ]);
  assert.equal(v, "ok");
});
test("model registry uses Groq OSS model", () => {
  const r = new ModelRegistry();
  assert.equal(r.get("balanced").model, "openai/gpt-oss-20b");
});
test("model router selects quality for high complexity", () => {
  const r = new ModelRouter(new ModelRegistry());
  assert.equal(r.select({ task: "chat", complexity: "high" }).costTier, "high");
});
test("cost tracker estimates usage", () => {
  const c = new CostTracker();
  c.record({ inputTokens: 1000, outputTokens: 2000 });
  assert.equal(c.summary().estimatedCostUsd, 0.000675);
});
