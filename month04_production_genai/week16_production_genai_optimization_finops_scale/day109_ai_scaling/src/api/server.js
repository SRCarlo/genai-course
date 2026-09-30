import express from "express";
import { config } from "../config/load-config.js";
import { runLLM } from "../llm/llm-worker.js";
import { ConcurrencyLimiter } from "../scaling/concurrency.js";
import { JobQueue } from "../queue/job-queue.js";

const app = express();
app.use(express.json());

const limiter = new ConcurrencyLimiter(config.maxConcurrentLLM);
const queue = new JobQueue(config.maxQueueSize);

const rateBuckets = new Map();

function rateLimit(req, res, next) {
  const key = req.ip || "unknown";
  const now = Date.now();

  let bucket = rateBuckets.get(key);

  if (!bucket || now - bucket.startedAt >= config.rateLimitWindowMs) {
    bucket = { startedAt: now, count: 0 };
    rateBuckets.set(key, bucket);
  }

  bucket.count++;

  if (bucket.count > config.rateLimitMax) {
    return res.status(429).json({
      error: "Rate limit exceeded",
      retryAfter: Math.ceil(
        (config.rateLimitWindowMs - (now - bucket.startedAt)) / 1000
      )
    });
  }

  next();
}

function withTimeout(promise, timeoutMs) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      const timer = setTimeout(() => {
        const error = new Error("LLM request timed out");
        error.code = "TIMEOUT";
        reject(error);
      }, timeoutMs);

      promise.finally(() => clearTimeout(timer)).catch(() => {});
    })
  ]);
}

app.use(rateLimit);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    provider: config.llmProvider,
    model:
      config.llmProvider === "groq"
        ? config.groqModel
        : "mock-llm"
  });
});

app.get("/metrics", (req, res) => {
  res.json({
    queue: queue.snapshot(),
    concurrency: limiter.stats(),
    provider: config.llmProvider,
    model:
      config.llmProvider === "groq"
        ? config.groqModel
        : "mock-llm"
  });
});

app.post("/generate", async (req, res) => {
  const start = performance.now();
  const message = req.body?.message || "Hello AI";

  try {
    queue.push({
      createdAt: Date.now()
    });
  } catch (error) {
    if (error.code === "QUEUE_FULL") {
      return res.status(429).json({
        error: "System overloaded",
        retryAfter: 5
      });
    }

    return res.status(500).json({ error: "Queue error" });
  }

  queue.shift();

  try {
    const result = await limiter.run(() =>
      withTimeout(
        runLLM({ message }),
        config.requestTimeoutMs
      )
    );

    const latencyMs = Number(
      (performance.now() - start).toFixed(2)
    );

    return res.json({
      result,
      latencyMs,
      concurrency: limiter.stats()
    });
  } catch (error) {
    const status = error.code === "TIMEOUT" ? 504 : 500;

    return res.status(status).json({
      error:
        error.code === "TIMEOUT"
          ? "Generation timed out"
          : "Generation failed",
      message: error.message
    });
  }
});

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
  console.log(`LLM provider: ${config.llmProvider}`);
  console.log(
    `LLM model: ${
      config.llmProvider === "groq"
        ? config.groqModel
        : "mock-llm"
    }`
  );
});
