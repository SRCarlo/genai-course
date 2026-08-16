import "dotenv/config";

import path from "node:path";
import { pathToFileURL } from "node:url";

let day63Module = null;

async function loadDay63Module() {
  if (day63Module) {
    return day63Module;
  }

  const entry = process.env.DAY63_ENTRY;

  if (!entry) {
    throw new Error("DAY63_ENTRY is missing from .env");
  }

  const absolutePath = path.resolve(process.cwd(), entry);

  day63Module = await import(pathToFileURL(absolutePath).href);

  return day63Module;
}

function normalizeUsage(usage = {}) {
  return {
    inputTokens:
      usage.inputTokens ?? usage.prompt_tokens ?? usage.promptTokens ?? 0,

    outputTokens:
      usage.outputTokens ??
      usage.completion_tokens ??
      usage.completionTokens ??
      0,

    totalTokens: usage.totalTokens ?? usage.total_tokens ?? 0,

    llmCalls: usage.llmCalls ?? 0,

    embeddingCalls: usage.embeddingCalls ?? 0,
  };
}

function normalizeRetrieved(result = {}) {
  return (
    result.retrieved ??
    result.retrievedDocuments ??
    result.documents ??
    result.context ??
    result.sources ??
    []
  );
}

function normalizeTools(result = {}) {
  if (Array.isArray(result.tools)) {
    return result.tools;
  }

  if (Array.isArray(result.trace)) {
    return result.trace
      .filter((item) => {
        const decision = item?.decision;

        return decision && decision !== "final";
      })
      .map((item) => item.decision);
  }

  return [];
}

function normalizeTrace(result = {}) {
  if (!Array.isArray(result.trace)) {
    return [];
  }

  return result.trace;
}

export async function runDay63Application(question) {
  const module = await loadDay63Module();

  const functionName = process.env.DAY63_FUNCTION || "runAgent";

  const runAgent = module[functionName];

  if (typeof runAgent !== "function") {
    throw new Error(
      `Day 63 function "${functionName}" was not found in ${process.env.DAY63_ENTRY}. ` +
        `Available exports: ${Object.keys(module).join(", ")}`,
    );
  }

  const start = Date.now();

  const sessionId = `day64-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;

  const result = await runAgent({
    question,
    sessionId,
  });

  const latencyMs = Date.now() - start;

  return {
    question,

    answer:
      result?.answer ??
      result?.finalAnswer ??
      result?.response ??
      result?.output ??
      result?.text ??
      "",

    retrieved: normalizeRetrieved(result),

    toolCalls: normalizeTools(result),

    trace: normalizeTrace(result),

    usage: normalizeUsage(result?.usage),

    latencyMs,

    raw: result,
  };
}
