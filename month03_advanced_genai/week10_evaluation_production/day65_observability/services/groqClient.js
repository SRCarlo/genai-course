import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function callGroq({
  messages,
  model = process.env.MODEL_NAME || "llama-3.1-8b-instant",

  temperature = 0.2,

  maxTokens = 1024,

  trace,
}) {
  const { startSpan, endSpan, recordSpanError } =
    await import("../observability/tracer.js");

  const span = startSpan(trace, "llm.call", {
    provider: "groq",
    model,
    temperature,
  });

  trace.summary.llmCalls += 1;

  try {
    const response = await groq.chat.completions.create({
      model,

      messages,

      temperature,

      max_tokens: maxTokens,
    });

    const usage = response.usage || {};

    const inputTokens = usage.prompt_tokens || 0;

    const outputTokens = usage.completion_tokens || 0;

    const totalTokens = usage.total_tokens || inputTokens + outputTokens;

    span.attributes = {
      ...span.attributes,

      inputTokens,

      outputTokens,

      totalTokens,

      finishReason: response.choices?.[0]?.finish_reason,
    };

    trace.summary.inputTokens += inputTokens;

    trace.summary.outputTokens += outputTokens;

    trace.summary.totalTokens += totalTokens;

    endSpan(span, "success");

    return response;
  } catch (error) {
    recordSpanError(span, error);

    throw error;
  }
}
