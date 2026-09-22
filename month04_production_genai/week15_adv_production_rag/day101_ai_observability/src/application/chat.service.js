import { retrieveDocuments } from "../ai/retrieval/retriever.js";
import { generateAnswer } from "../ai/llm/groq.client.js";
import { validateContextSize } from "../ai/rag/context.guard.js";
import { createTrace } from "../infrastructure/observability/trace.js";
import { startTimer } from "../infrastructure/observability/timer.js";
import { logger } from "../infrastructure/observability/logger.js";
import {
  increment,
  recordLatency,
  recordTokens,
  recordCost,
  recordQuality,
} from "../infrastructure/observability/metrics.js";

function estimateTokens(text) {
  return text ? Math.ceil(text.length / 4) : 0;
}
function estimateCost(inputTokens, outputTokens) {
  const inputRate = Number(process.env.COST_INPUT_PER_1M || 0.075);
  const outputRate = Number(process.env.COST_OUTPUT_PER_1M || 0.3);
  return (
    (inputTokens / 1_000_000) * inputRate +
    (outputTokens / 1_000_000) * outputRate
  );
}
function buildContext(documents) {
  return documents
    .map(
      (d, i) => `[Document ${i + 1}]\nTitle: ${d.title}\nContent: ${d.content}`,
    )
    .join("\n\n");
}
function calculateDemoRecall(docs) {
  return docs.length
    ? Math.min(docs.filter((d) => d.score > 0).length / 5, 1)
    : 0;
}
function calculateDemoFaithfulness(answer, context) {
  if (!answer || !context) return 0;
  const words = new Set(
    answer
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 4),
  );
  const ctx = new Set(
    context
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 4),
  );
  if (!words.size) return 0;
  let grounded = 0;
  for (const w of words) if (ctx.has(w)) grounded++;
  return Number(Math.min(grounded / words.size, 1).toFixed(4));
}
function calculateDemoRelevance(question, answer) {
  if (!question || !answer) return 0;
  const q = new Set(
    question
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 3),
  );
  const a = new Set(
    answer
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 3),
  );
  if (!q.size) return 0;
  let matches = 0;
  for (const w of q) if (a.has(w)) matches++;
  return Number(Math.min(matches / q.size, 1).toFixed(4));
}
export async function processChat({ question, requestId }) {
  const trace = createTrace(requestId);
  logger.info({ event: "rag_request_started", requestId, question });

  const retrievalTimer = startTimer();
  const retrievalSpan = trace.startSpan("retrieval");
  increment("retrievalRequests");
  let documents;
  try {
    documents = await retrieveDocuments(question, 5);
  } finally {
    const latencyMs = retrievalTimer.elapsed();
    recordLatency("retrieval", latencyMs);
    retrievalSpan.end({ resultCount: documents?.length || 0 });
    logger.info({
      event: "retrieval_completed",
      requestId,
      resultCount: documents?.length || 0,
      latencyMs,
    });
  }

  const context = buildContext(documents);
  const contextTokens = estimateTokens(context);
  const maxContextTokens = Number(process.env.MAX_CONTEXT_TOKENS || 6000);
  validateContextSize(contextTokens, maxContextTokens);

  const llmTimer = startTimer();
  const llmSpan = trace.startSpan("llm");
  increment("llmRequests");
  let llmResult;
  try {
    llmResult = await generateAnswer({ question, context, requestId });
  } catch (error) {
    increment("errors");
    logger.error({
      event: "llm_request_failed",
      requestId,
      error: error.message,
    });
    throw error;
  } finally {
    const latencyMs = llmTimer.elapsed();
    recordLatency("llm", latencyMs);
    llmSpan.end({ model: process.env.GROQ_MODEL || "openai/gpt-oss-20b" });
    logger.info({ event: "llm_operation_completed", requestId, latencyMs });
  }

  recordTokens({
    inputTokens: llmResult.inputTokens,
    outputTokens: llmResult.outputTokens,
    totalTokens: llmResult.totalTokens,
    contextTokens,
  });

  const estimatedCost = estimateCost(
    llmResult.inputTokens,
    llmResult.outputTokens,
  );
  recordCost(estimatedCost);

  logger.info({
    event: "llm_request_completed",
    requestId,
    provider: "groq",
    model: llmResult.model,
    inputTokens: llmResult.inputTokens,
    outputTokens: llmResult.outputTokens,
    totalTokens: llmResult.totalTokens,
    estimatedCost,
  });

  const faithfulness = calculateDemoFaithfulness(llmResult.answer, context);
  const answerRelevance = calculateDemoRelevance(question, llmResult.answer);
  const recallAt5 = calculateDemoRecall(documents);
  recordQuality({ faithfulness, answerRelevance, recallAt5 });

  logger.info({
    event: "rag_completed",
    requestId,
    retrievedDocuments: documents.length,
    contextTokens,
    faithfulness,
    answerRelevance,
    recallAt5,
  });

  return {
    requestId,
    answer: llmResult.answer,
    documents: documents.map(({ id, title, score }) => ({ id, title, score })),
    metrics: {
      inputTokens: llmResult.inputTokens,
      outputTokens: llmResult.outputTokens,
      totalTokens: llmResult.totalTokens,
      contextTokens,
      estimatedCost,
      faithfulness,
      answerRelevance,
      recallAt5,
    },
    trace: trace.getTrace(),
  };
}
