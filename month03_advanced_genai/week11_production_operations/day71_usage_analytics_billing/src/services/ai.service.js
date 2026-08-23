import Groq from "groq-sdk";

import { env } from "../config/env.js";

import { recordUsage } from "./usage.service.js";

const groq = new Groq({
  apiKey: env.groqApiKey,
});

export async function generateAIResponse({
  requestId,
  userId,
  tenantId,
  endpoint,
  message,
}) {
  const start = Date.now();

  try {
    const completion = await groq.chat.completions.create({
      model: env.groqModel,

      messages: [
        {
          role: "user",
          content: message,
        },
      ],

      include_reasoning: false,

      max_completion_tokens: 1024,
    });

    const latencyMs = Date.now() - start;

    const usage = completion.usage || {};

    const inputTokens = usage.prompt_tokens || 0;

    const outputTokens = usage.completion_tokens || 0;

    const usageResult = recordUsage({
      requestId,
      userId,
      tenantId,
      model: env.groqModel,
      endpoint,

      inputTokens,
      outputTokens,

      latencyMs,

      status: "success",
    });

    return {
      response: completion.choices?.[0]?.message?.content || "",

      usage: usageResult.event,

      providerResponseId: completion.id,
    };
  } catch (error) {
    const latencyMs = Date.now() - start;

    recordUsage({
      requestId,
      userId,
      tenantId,
      model: env.groqModel,
      endpoint,

      inputTokens: 0,
      outputTokens: 0,

      latencyMs,

      status: error?.status === 429 ? "rate_limited" : "failed",
    });

    throw error;
  }
}
