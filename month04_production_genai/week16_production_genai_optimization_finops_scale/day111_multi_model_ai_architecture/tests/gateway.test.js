import test from "node:test";
import assert from "node:assert/strict";

import { ModelRegistry } from "../src/models/model-registry.js";
import { ModelRouter } from "../src/router/model-router.js";
import { ProviderRouter } from "../src/router/provider-router.js";
import { ProviderHealth } from "../src/router/provider-health.js";
import { AIGateway } from "../src/gateway/ai-gateway.js";
import { ProviderA } from "../src/providers/provider-a.js";
import { ProviderB } from "../src/providers/provider-b.js";

test("gateway routes a request through model and provider", async () => {
  const health = new ProviderHealth();
  health.set("provider-a", true);

  const gateway = new AIGateway({
    modelRouter: new ModelRouter(new ModelRegistry()),
    providerRouter: new ProviderRouter({
      "provider-a": new ProviderA({
        apiKey: "test-key"
      })
    }),
    healthRegistry: health
  });

  const provider = gateway.providerRouter.get("provider-a");
  provider.generate = async (request) => ({
    provider: "provider-a",
    model: request.model,
    text: "test response",
    usage: { total_tokens: 10 }
  });

  const result = await gateway.generate({
    task: "classification",
    complexity: "low",
    prompt: "Hello"
  });

  assert.equal(result.status, "success");
  assert.equal(result.modelTier, "fast");
  assert.equal(result.provider, "provider-a");
  assert.equal(result.fallback, false);
});
