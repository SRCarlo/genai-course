import test from "node:test";
import assert from "node:assert/strict";

import { ModelRegistry } from "../src/models/model-registry.js";
import { ModelRouter } from "../src/router/model-router.js";
import { ProviderRouter } from "../src/router/provider-router.js";
import { ProviderHealth } from "../src/router/provider-health.js";
import { AIGateway } from "../src/gateway/ai-gateway.js";
import { ProviderA } from "../src/providers/provider-a.js";
import { ProviderB } from "../src/providers/provider-b.js";

test("gateway falls back from provider-a to provider-b", async () => {
  const health = new ProviderHealth();
  health.set("provider-a", true);
  health.set("provider-b", true);

  const primary = new ProviderA({ apiKey: "test-key" });
  primary.generate = async () => {
    throw new Error("simulated primary failure");
  };

  const secondary = new ProviderB({
    handler: async (request) => ({
      provider: "provider-b",
      model: request.model,
      text: "fallback success",
      usage: null
    })
  });

  const gateway = new AIGateway({
    modelRouter: new ModelRouter(new ModelRegistry()),
    providerRouter: new ProviderRouter({
      "provider-a": primary,
      "provider-b": secondary
    }),
    healthRegistry: health
  });

  const result = await gateway.generate({
    task: "chat",
    complexity: "medium",
    prompt: "Hello",
    deadlineMs: 5000
  });

  assert.equal(result.fallback, true);
  assert.equal(result.provider, "provider-b");
  assert.equal(result.status, "success");
});
