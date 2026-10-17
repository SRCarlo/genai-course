import { SpanStatusCode } from "@opentelemetry/api";
import { tracer } from "./tracer.js";

const ALLOWED_ATTRIBUTES = new Set([
  "app.request_id",
  "genai.operation",
  "genai.provider",
  "genai.model",
]);

function safeAttributes(attributes = {}) {
  const safe = {};
  for (const [key, value] of Object.entries(attributes)) {
    if (!ALLOWED_ATTRIBUTES.has(key)) continue;
    if (typeof value === "string") safe[key] = value.slice(0, 128);
    else if (typeof value === "boolean") safe[key] = value;
    else if (typeof value === "number" && Number.isFinite(value)) safe[key] = value;
  }
  return safe;
}

async function inSpan(name, operation, attributes, onSuccess) {
  return tracer.startActiveSpan(name, async (span) => {
    const startedAt = performance.now();
    try {
      span.setAttributes(safeAttributes(attributes));
      const result = await operation();
      if (onSuccess) onSuccess(span, result);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message.slice(0, 200) : "Operation failed",
      });
      if (error instanceof Error) span.recordException(error);
      throw error;
    } finally {
      span.setAttribute("app.operation.duration_ms", Number((performance.now() - startedAt).toFixed(2)));
      span.end();
    }
  });
}

export function traceRetrieval(search, attributes = {}) {
  return inSpan(
    "genai.retrieval",
    search,
    { ...attributes, "genai.operation": "retrieval" },
    (span, result) => {
      if (Array.isArray(result)) span.setAttribute("genai.retrieval.result_count", result.length);
    },
  );
}

export function traceGeneration(generate, attributes = {}) {
  return inSpan(
    "genai.generation",
    generate,
    { ...attributes, "genai.operation": "generation" },
    (span, result) => {
      if (typeof result?.model === "string") span.setAttribute("genai.model", result.model.slice(0, 128));
      const usage = result?.usage;
      for (const key of ["inputTokens", "outputTokens", "totalTokens"]) {
        const value = usage?.[key];
        if (Number.isInteger(value) && value >= 0) {
          const attr = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
          span.setAttribute(`genai.usage.${attr}`, value);
        }
      }
    },
  );
}
