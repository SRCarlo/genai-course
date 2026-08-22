const plans = {
  free: {
    name: "free",

    requestsPerMinute: 10,

    monthlyTokens: 100000,

    maxOutputTokens: 512,

    maxPromptTokens: 4000,

    maxConcurrentRequests: 2,

    allowedModels: [
      "openai/gpt-oss-20b",
    ],
  },

  pro: {
    name: "pro",

    requestsPerMinute: 60,

    monthlyTokens: 2000000,

    maxOutputTokens: 2048,

    maxPromptTokens: 12000,

    maxConcurrentRequests: 5,

    allowedModels: [
      "openai/gpt-oss-20b",
      "openai/gpt-oss-120b",
    ],
  },

  enterprise: {
    name: "enterprise",

    requestsPerMinute: 300,

    monthlyTokens: 20000000,

    maxOutputTokens: 4096,

    maxPromptTokens: 30000,

    maxConcurrentRequests: 20,

    allowedModels: [
      "openai/gpt-oss-20b",
      "openai/gpt-oss-120b",
      "qwen/qwen3.6-27b",
    ],
  },
};

export function getPlan(planName = "free") {
  return plans[planName] || plans.free;
}

export default plans;