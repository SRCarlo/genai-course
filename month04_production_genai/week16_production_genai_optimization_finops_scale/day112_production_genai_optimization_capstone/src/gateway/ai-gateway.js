import { retry } from "../resilience/retry.js";
import { fallback } from "../resilience/fallback.js";
import { log } from "../observability/logger.js";
import { evaluateResponse } from "../evaluation/evaluator.js";

export class AIGateway {
  constructor({
    modelRouter,
    providerRouter,
    cache,
    metrics,
    costTracker,
    circuits,
    retryOptions,
  }) {
    Object.assign(this, {
      modelRouter,
      providerRouter,
      cache,
      metrics,
      costTracker,
      circuits,
      retryOptions,
    });
  }

  async generate(request) {
    const started = Date.now();
    const cacheKey = JSON.stringify({
      task: request.task,
      complexity: request.complexity,
      prompt: request.prompt,
      systemPrompt: request.systemPrompt,
      model: request.model,
    });
    const cached = this.cache.get(cacheKey);
    if (cached) {
      this.metrics.increment("cacheHits");
      return { ...cached, cached: true };
    }

    const selected = this.modelRouter.select(request);
    const primary = this.providerRouter.get(selected.provider);
    const fallbackProviderName =
      selected.provider === "provider-a" ? "provider-b" : "provider-a";
    const secondary = this.providerRouter.get(fallbackProviderName);
    const candidates = [primary, secondary];
    let result;

    for (let index = 0; index < candidates.length; index += 1) {
      const provider = candidates[index];
      const circuit = this.circuits.get(provider.name);
      if (!circuit.canRequest()) continue;
      try {
        result = await retry(
          () => provider.generate({ ...request, model: selected.model }),
          this.retryOptions,
        );
        circuit.success();
        if (index > 0) this.metrics.increment("fallbacks");
        break;
      } catch (error) {
        circuit.failure();
        if (index === 0) this.metrics.increment("retries");
        if (index === candidates.length - 1) throw error;
      }
    }

    const evaluation = evaluateResponse(result);
    this.costTracker.record(result.usage);
    this.metrics.increment("requests");
    this.metrics.increment("successes");
    this.metrics.addLatency(Date.now() - started);
    const response = { ...result, evaluation, cached: false };
    this.cache.set(cacheKey, response);
    log("ai.request.success", {
      provider: result.provider,
      model: result.model,
      latencyMs: Date.now() - started,
    });
    return response;
  }
}
