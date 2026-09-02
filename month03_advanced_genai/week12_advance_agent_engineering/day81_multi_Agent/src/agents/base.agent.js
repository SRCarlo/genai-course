import Groq from "groq-sdk";

import { env } from "../config/env.js";

import { logger } from "../orchestration/logger.js";

export class BaseAgent {
  constructor({
    name,
    role,
    systemPrompt,
    permissions = [],
    allowedTools = [],
  }) {
    this.name = name;

    this.role = role;

    this.systemPrompt = systemPrompt;

    this.permissions = permissions;

    this.allowedTools = allowedTools;

    this.groq = new Groq({
      apiKey: env.groqApiKey,
    });
  }

  async askModel(
    input,
    {
      temperature = 0.2,

      maxCompletionTokens = 2000,

      reasoningEffort = "medium",

      responseFormat = undefined,
    } = {},
  ) {
    const userContent =
      typeof input === "string" ? input : JSON.stringify(input, null, 2);

    const request = {
      model: env.model,

      messages: [
        {
          role: "system",

          content: this.systemPrompt,
        },

        {
          role: "user",

          content: userContent,
        },
      ],

      temperature,

      max_completion_tokens: maxCompletionTokens,

      reasoning_effort: reasoningEffort,
    };

    if (responseFormat) {
      request.response_format = responseFormat;
    }

    const started = Date.now();

    logger.info("LLM request started", {
      agent: this.name,

      model: env.model,
    });

    const completion = await this.groq.chat.completions.create(request);

    const latency = Date.now() - started;

    const usage = completion.usage || {};

    logger.info("LLM request completed", {
      agent: this.name,

      model: env.model,

      latencyMs: latency,

      usage,
    });

    return {
      content: completion.choices?.[0]?.message?.content || "",

      usage,

      latencyMs: latency,
    };
  }

  async run() {
    throw new Error(`${this.name}.run() must be implemented`);
  }
}
