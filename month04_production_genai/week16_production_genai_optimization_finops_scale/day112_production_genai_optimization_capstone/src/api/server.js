import express from "express";
import { config } from "../config/config.js";
import { ResponseCache } from "../cache/response-cache.js";
import { RateLimiter } from "../rate-limit/rate-limiter.js";
import { validateGenerateRequest } from "../security/input-validation.js";
import { authenticate } from "../security/auth.js";
import { ModelRegistry } from "../models/model-registry.js";
import { ModelRouter } from "../router/model-router.js";
import { ProviderRouter } from "../router/provider-router.js";
import { ProviderA } from "../providers/provider-a.js";
import { ProviderB } from "../providers/provider-b.js";
import { CircuitBreaker } from "../resilience/circuit-breaker.js";
import { AIGateway } from "../gateway/ai-gateway.js";
import { Metrics } from "../observability/metrics.js";
import { CostTracker } from "../cost/cost-tracker.js";
import { getRequestId } from "../observability/tracing.js";

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "256kb" }));

const cache = new ResponseCache(config.cache.ttlMs);
const limiter = new RateLimiter(config.rateLimit);
const registry = new ModelRegistry(config.groq.model);
const modelRouter = new ModelRouter(registry);
const providerOptions = {
  apiKey: config.groq.apiKey,
  model: config.groq.model,
  timeoutMs: config.ai.requestTimeoutMs,
  simulateFailure: config.simulation.enabled,
  failureRate: config.simulation.failureRate,
};
const providerRouter = new ProviderRouter({
  "provider-a": new ProviderA(providerOptions),
  "provider-b": new ProviderB(providerOptions),
});
const metrics = new Metrics();
const costTracker = new CostTracker();
const circuits = new Map([
  ["groq-primary", new CircuitBreaker(config.circuit)],
  ["groq-fallback", new CircuitBreaker(config.circuit)],
]);
const gateway = new AIGateway({
  modelRouter,
  providerRouter,
  cache,
  metrics,
  costTracker,
  circuits,
  retryOptions: config.retry,
});

app.use((req, res, next) => {
  const requestId = getRequestId(req);
  res.setHeader("x-request-id", requestId);
  req.requestId = requestId;
  next();
});

app.post("/generate", async (req, res) => {
  try {
    authenticate(req, config.auth);
    const clientId = req.ip || "unknown";
    if (!limiter.allow(clientId))
      return res
        .status(429)
        .json({ error: "Rate limit exceeded", requestId: req.requestId });
    const request = validateGenerateRequest(req.body);
    const result = await gateway.generate(request);
    res.json({ ...result, requestId: req.requestId });
  } catch (error) {
    metrics.increment("failures");
    const status =
      error.message.includes("Authorization") ||
      error.message.includes("Invalid token")
        ? 401
        : error.message === "Rate limit exceeded"
          ? 429
          : error.status && error.status >= 400 && error.status < 500
            ? error.status
            : 500;
    res.status(status).json({ error: error.message, requestId: req.requestId });
  }
});

app.get("/health", (req, res) =>
  res.json({
    status: "ok",
    model: config.groq.model,
    providers: providerRouter.list(),
  }),
);
app.get("/models", (req, res) => res.json(registry.list()));
app.get("/metrics", (req, res) => res.json(metrics.snapshot()));
app.get("/cost", (req, res) => res.json(costTracker.summary()));
app.get("/circuits", (req, res) =>
  res.json(
    Object.fromEntries(
      [...circuits.entries()].map(([name, circuit]) => [
        name,
        circuit.snapshot(),
      ]),
    ),
  ),
);

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError)
    return res
      .status(400)
      .json({ error: "Invalid JSON", requestId: req.requestId });
  return next(error);
});

if (process.env.NODE_ENV !== "test") {
  app.listen(config.port, () =>
    console.log(`Production AI platform running on port ${config.port}`),
  );
}

export { app };
