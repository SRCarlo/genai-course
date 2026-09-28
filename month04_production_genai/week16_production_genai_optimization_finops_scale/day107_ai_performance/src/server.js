import "dotenv/config";
import express from "express";
import { runSimulatedPipeline, askGroq } from "./pipeline.js";
import { setupSSE, streamGroqResponse } from "./streaming/stream-handler.js";
import { ConcurrencyLimiter } from "./performance/concurrency.js";

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT || 3000);
const limiter = new ConcurrencyLimiter(
  Number(process.env.CONCURRENCY_LIMIT || 5),
);
const LLM_TIMEOUT_MS = Number(process.env.LLM_TIMEOUT_MS || 15000);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
  });
});

app.get("/api/performance/demo", async (req, res, next) => {
  try {
    const result = await runSimulatedPipeline({
      query: req.query.q || "What is our refund policy?",
      slowLlmMs: Number(req.query.slowLlmMs || 0),
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.post("/api/chat", async (req, res, next) => {
  try {
    const query = String(req.body?.query || "").trim();
    if (!query) return res.status(400).json({ error: "query is required" });

    const result = await limiter.run(() =>
      askGroq({
        query,
        timeoutMs: LLM_TIMEOUT_MS,
      }),
    );

    res.json({
      ...result,
      concurrency: { active: limiter.activeCount, queued: limiter.queuedCount },
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/chat/stream", async (req, res) => {
  setupSSE(res);
  const query = String(
    req.query.q || "Tell me one practical tip for improving AI latency.",
  ).trim();

  try {
    await limiter.run(() =>
      streamGroqResponse({
        req,
        res,
        messages: [
          { role: "system", content: "Answer clearly and concisely." },
          { role: "user", content: query },
        ],
        maxCompletionTokens: 256,
      }),
    );
  } catch (error) {
    console.error("Streaming error:", error.message);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  if (res.headersSent) return;
  res.status(500).json({ error: error.message });
});

app.listen(PORT, () => {
  console.log(`Day 107 server running on http://localhost:${PORT}`);
});
