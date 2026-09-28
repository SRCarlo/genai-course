import { randomUUID } from "node:crypto";
import { generateText } from "./llm/groq-client.js";
import { startTimer, elapsedMs } from "./performance/timer.js";
import { createPerformanceEvent } from "./performance/performance-event.js";
import { checkAllBudgets } from "./performance/performance-budget.js";
import { withTimeout } from "./performance/timeout.js";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function timedStage({ requestId, stage, task }) {
  const start = startTimer();
  const result = await task();
  const durationMs = elapsedMs(start);
  return {
    result,
    durationMs,
    event: createPerformanceEvent({ requestId, stage, durationMs })
  };
}

export async function runSimulatedPipeline({ query, slowLlmMs = 0 } = {}) {
  const requestId = randomUUID();
  const requestStart = startTimer();

  const auth = await timedStage({
    requestId,
    stage: "authentication",
    task: () => sleep(50).then(() => ({ userId: "demo-user" }))
  });

  const retrieval = await timedStage({
    requestId,
    stage: "retrieval",
    task: () => sleep(180).then(() => [
      { id: 1, text: `Refund policy context for: ${query}` },
      { id: 2, text: "Refunds are processed according to the published policy." }
    ])
  });

  const reranking = await timedStage({
    requestId,
    stage: "reranking",
    task: () => sleep(250).then(() => retrieval.result)
  });

  const llm = await timedStage({
    requestId,
    stage: "llm",
    task: async () => {
      if (slowLlmMs > 0) await sleep(slowLlmMs);
      return `Simulated answer for: ${query}`;
    }
  });

  const totalMs = elapsedMs(requestStart);
  const measurements = {
    authentication: auth.durationMs,
    retrieval: retrieval.durationMs,
    reranking: reranking.durationMs,
    llm: llm.durationMs,
    total: totalMs
  };

  return {
    requestId,
    answer: llm.result,
    measurements,
    budgets: checkAllBudgets(measurements),
    events: [auth.event, retrieval.event, reranking.event, llm.event,
      createPerformanceEvent({ requestId, stage: "total", durationMs: totalMs })]
  };
}

export async function askGroq({ query, timeoutMs = 15000 }) {
  const requestId = randomUUID();
  const start = startTimer();

  const response = await withTimeout(
    generateText({
      messages: [
        {
          role: "system",
          content: "Answer concisely. You are being used in a latency engineering benchmark."
        },
        { role: "user", content: query }
      ],
      maxCompletionTokens: 256
    }),
    timeoutMs,
    `Groq request timed out after ${timeoutMs}ms`
  );

  const totalMs = elapsedMs(start);
  return {
    requestId,
    answer: response.choices?.[0]?.message?.content || "",
    totalMs: Number(totalMs.toFixed(2)),
    usage: response.usage || null
  };
}
