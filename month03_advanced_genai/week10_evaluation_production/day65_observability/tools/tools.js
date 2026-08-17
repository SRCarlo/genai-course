import {
  startSpan,
  endSpan,
  recordSpanError,
} from "../observability/tracer.js";

import { searchKnowledge } from "../rag/ragService.js";

export async function knowledgeSearchTool({ query, trace }) {
  const span = startSpan(trace, "tool.call", {
    tool: "knowledge_search",
  });

  trace.summary.toolCalls += 1;

  try {
    const results = await searchKnowledge({
      query,
      trace,
    });

    span.attributes = {
      ...span.attributes,

      status: "success",

      resultCount: results.length,
    };

    endSpan(span, "success");

    return results;
  } catch (error) {
    recordSpanError(span, error);

    throw error;
  }
}

export async function calculatorTool({ expression, trace }) {
  const span = startSpan(trace, "tool.call", {
    tool: "calculator",
  });

  trace.summary.toolCalls += 1;

  try {
    const safeExpression = expression.replace(/[^0-9+\-*/().% ]/g, "");

    const result = Function(`"use strict"; return (${safeExpression})`)();

    span.attributes = {
      ...span.attributes,

      expression: safeExpression,

      result,
    };

    endSpan(span, "success");

    return result;
  } catch (error) {
    recordSpanError(span, error);

    throw error;
  }
}
