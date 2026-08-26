import Groq from "groq-sdk";
import dotenv from "dotenv";
import { estimateTokens } from "../utils/tokens.js";
import { calculateCost } from "../utils/metrics.js";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const DEFAULT_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

export async function generateText({
  systemPrompt,
  userInput,
  context = "",
  model = DEFAULT_MODEL,
  temperature = 0.3,
  maxCompletionTokens = 500,
  reasoningEffort = "low",
}) {
  const startTime = performance.now();

  const messages = [
    {
      role: "system",
      content: systemPrompt,
    },
  ];

  if (context) {
    messages.push({
      role: "system",
      content: `Relevant context:\n${context}`,
    });
  }

  messages.push({
    role: "user",
    content: userInput,
  });

  const response = await groq.chat.completions.create({
    model,
    messages,
    temperature,
    max_completion_tokens: maxCompletionTokens,
    reasoning_effort: reasoningEffort,
  });

  const endTime = performance.now();

  const content = response.choices?.[0]?.message?.content || "";

  const usage = response.usage || {};

  const inputTokens =
    usage.prompt_tokens ||
    estimateTokens(messages.map((message) => message.content).join("\n"));

  const outputTokens = usage.completion_tokens || estimateTokens(content);

  const latencyMs = Math.round(endTime - startTime);

  const costPerRequest = calculateCost({
    inputTokens,
    outputTokens,
  });

  return {
    content,
    model,
    latencyMs,
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    costPerRequest,
    rawUsage: usage,
  };
}

export async function generateStructuredOutput({
  systemPrompt,
  userInput,
  schema,
  schemaName = "response",
  model = DEFAULT_MODEL,
}) {
  const startTime = performance.now();

  const response = await groq.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userInput,
      },
    ],
    temperature: 0.1,
    max_completion_tokens: 500,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: schemaName,
        strict: true,
        schema,
      },
    },
  });

  const endTime = performance.now();

  const content = response.choices?.[0]?.message?.content || "{}";

  let parsed;

  try {
    parsed = JSON.parse(content);
  } catch (error) {
    throw new Error(`Groq returned invalid JSON: ${error.message}`);
  }

  const latencyMs = Math.round(endTime - startTime);

  const usage = response.usage || {};

  const inputTokens = usage.prompt_tokens || 0;
  const outputTokens = usage.completion_tokens || 0;

  return {
    data: parsed,
    model,
    latencyMs,
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    costPerRequest: calculateCost({
      inputTokens,
      outputTokens,
    }),
  };
}
