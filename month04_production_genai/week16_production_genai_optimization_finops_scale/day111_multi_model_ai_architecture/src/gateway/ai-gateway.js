import { randomUUID } from "node:crypto";
import { getFallbackProviders } from "../policies/routing-policy.js";

export class AIGateway {
  constructor({
    modelRouter,
    providerRouter,
    healthRegistry,
    defaultDeadlineMs = 5000
  }) {
    this.modelRouter = modelRouter;
    this.providerRouter = providerRouter;
    this.healthRegistry = healthRegistry;
    this.defaultDeadlineMs = defaultDeadlineMs;
  }

  async generate(request = {}) {
    const requestId = request.requestId || randomUUID();
    const startedAt = Date.now();
    const deadline =
      request.deadline || startedAt + (request.deadlineMs || this.defaultDeadlineMs);

    const selectedModel = this.modelRouter.select({
      task: request.task,
      complexity: request.complexity,
      maxCostTier: request.maxCostTier,
      requiredCapabilities: {
        reasoning: Boolean(request.requiresReasoning),
        tools: Boolean(request.requiresTools),
        structuredOutput: Boolean(request.requiresStructuredOutput)
      }
    });

    const providers = getFallbackProviders(selectedModel.tier);
    const preferredProvider = selectedModel.provider;
    const orderedProviders = [
      preferredProvider,
      ...providers.filter((provider) => provider !== preferredProvider)
    ];

    let lastError = null;
    let fallback = false;
    let attempts = 0;

    for (const providerName of orderedProviders) {
      if (Date.now() >= deadline) {
        throw new Error("Request deadline exceeded before provider execution");
      }

      if (this.healthRegistry && !this.healthRegistry.isHealthy(providerName)) {
        fallback = true;
        continue;
      }

      attempts += 1;

      try {
        const provider = this.providerRouter.get(providerName);

        const result = await provider.generate({
          ...request,
          model: selectedModel.model,
          reasoningEffort: selectedModel.reasoningEffort,
          deadline
        });

        return {
          requestId,
          task: request.task || "general",
          modelTier: selectedModel.tier,
          model: result.model || selectedModel.model,
          provider: result.provider || providerName,
          fallback,
          attempts,
          latencyMs: Date.now() - startedAt,
          status: "success",
          usage: result.usage || null,
          text: result.text
        };
      } catch (error) {
        lastError = error;
        fallback = true;

        if (Date.now() >= deadline) {
          break;
        }
      }
    }

    const error = new Error(
      lastError?.message || "All providers failed or were unavailable"
    );

    error.metadata = {
      requestId,
      modelTier: selectedModel.tier,
      fallback,
      attempts,
      latencyMs: Date.now() - startedAt,
      status: "failed"
    };

    throw error;
  }
}
