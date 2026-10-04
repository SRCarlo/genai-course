import Groq from "groq-sdk";

export class AIGateway {
  constructor({
    tenantResolver,
    tenantPolicy,
    modelPolicy,
    rateLimiter,
    budgetManager,
    usageMeter,
    costTracker,
    groqClient,
    defaultModel
  }) {
    this.tenantResolver = tenantResolver;
    this.tenantPolicy = tenantPolicy;
    this.modelPolicy = modelPolicy;
    this.rateLimiter = rateLimiter;
    this.budgetManager = budgetManager;
    this.usageMeter = usageMeter;
    this.costTracker = costTracker;
    this.groqClient = groqClient;
    this.defaultModel = defaultModel;
  }

  estimateInputTokens(prompt) {
    return Math.max(1, Math.ceil(prompt.length / 4));
  }

  async generate({ tenantId, userId, model = "fast", prompt }) {
    if (!prompt || typeof prompt !== "string") {
      throw new Error("prompt is required");
    }

    if (prompt.length > 20_000) {
      throw new Error("prompt is too long");
    }

    const tenant = this.tenantResolver.resolve(tenantId);
    const policy = this.tenantPolicy.get(tenant.plan);
    const providerModel = this.modelPolicy.validate(policy, model);

    const allowed = this.rateLimiter.allow(
      tenant.id,
      policy.maxRequestsPerMinute
    );

    if (!allowed) {
      throw new Error("Tenant rate limit exceeded");
    }

    const estimatedInputTokens = this.estimateInputTokens(prompt);

    if (
      !this.budgetManager.canUse(
        tenant.id,
        estimatedInputTokens,
        policy.monthlyTokens
      )
    ) {
      throw new Error("Tenant token budget exceeded");
    }

    const response = await this.groqClient.chat.completions.create({
      model: providerModel,
      messages: [
        {
          role: "system",
          content:
            "You are the AI assistant for a multi-tenant SaaS platform. Never claim access to data that is not supplied in this request."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_completion_tokens: 1_000,
      reasoning_effort: "medium"
    });

    const text = response.choices?.[0]?.message?.content ?? "";
    const inputTokens =
      response.usage?.prompt_tokens ?? estimatedInputTokens;
    const outputTokens = response.usage?.completion_tokens ?? 0;

    this.budgetManager.record(
      tenant.id,
      inputTokens + outputTokens
    );

    const usage = this.usageMeter.record({
      tenantId: tenant.id,
      userId,
      model: providerModel,
      inputTokens,
      outputTokens
    });

    const estimatedCost = this.costTracker.estimate({
      model: providerModel,
      inputTokens,
      outputTokens
    });

    return {
      text,
      model: providerModel,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        plan: tenant.plan
      },
      usage,
      estimatedCostUsd: estimatedCost
    };
  }
}