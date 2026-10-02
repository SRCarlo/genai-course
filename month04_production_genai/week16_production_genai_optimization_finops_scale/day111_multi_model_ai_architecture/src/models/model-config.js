const groqModel = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

export const models = {
  fast: {
    provider: "provider-a",
    model: groqModel,
    costTier: "low",
    latencyTier: "low",
    capabilities: {
      reasoning: true,
      tools: true,
      structuredOutput: true,
      vision: false
    },
    reasoningEffort: "low"
  },

  balanced: {
    provider: "provider-a",
    model: groqModel,
    costTier: "medium",
    latencyTier: "medium",
    capabilities: {
      reasoning: true,
      tools: true,
      structuredOutput: true,
      vision: false
    },
    reasoningEffort: "medium"
  },

  quality: {
    provider: "provider-a",
    model: groqModel,
    costTier: "high",
    latencyTier: "high",
    capabilities: {
      reasoning: true,
      tools: true,
      structuredOutput: true,
      vision: false
    },
    reasoningEffort: "high"
  }
};

export const costRank = {
  low: 1,
  medium: 2,
  high: 3
};
