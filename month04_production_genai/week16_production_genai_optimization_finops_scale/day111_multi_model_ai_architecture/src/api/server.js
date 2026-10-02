import "dotenv/config";
import express from "express";

import { ModelRegistry } from "../models/model-registry.js";
import { ModelRouter } from "../router/model-router.js";
import { ProviderRouter } from "../router/provider-router.js";
import { ProviderHealth } from "../router/provider-health.js";
import { AIGateway } from "../gateway/ai-gateway.js";
import { ProviderA } from "../providers/provider-a.js";
import { ProviderB } from "../providers/provider-b.js";
import { ProviderC } from "../providers/provider-c.js";

const app = express();
app.use(express.json());

const registry = new ModelRegistry();
const modelRouter = new ModelRouter(registry);
const healthRegistry = new ProviderHealth();

healthRegistry.set("provider-a", true);
healthRegistry.set("provider-b", true);
healthRegistry.set("provider-c", true);

const providerRouter = new ProviderRouter(
  {
    "provider-a": new ProviderA(),
    "provider-b": new ProviderB(),
    "provider-c": new ProviderC(),
  },
  healthRegistry,
);

const gateway = new AIGateway({
  modelRouter,
  providerRouter,
  healthRegistry,
  defaultDeadlineMs: Number(process.env.DEFAULT_DEADLINE_MS || 5000),
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "day111-ai-gateway",
    providers: healthRegistry.snapshot(),
  });
});

app.get("/models", (_req, res) => {
  res.json(registry.list());
});

app.get("/providers", (_req, res) => {
  res.json({
    providers: Object.keys(providerRouter.providers),
    health: healthRegistry.snapshot(),
  });
});

app.post("/providers/:provider/health", (req, res) => {
  const { provider } = req.params;

  if (!providerRouter.providers[provider]) {
    return res.status(404).json({ error: `Unknown provider: ${provider}` });
  }

  healthRegistry.set(provider, req.body.healthy !== false);

  return res.json({
    provider,
    healthy: healthRegistry.isHealthy(provider),
  });
});

app.post("/generate", async (req, res) => {
  try {
    const result = await gateway.generate(req.body);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      metadata: error.metadata || null,
    });
  }
});

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.log(`AI Gateway running on port ${port}`);
  console.log(`Groq model: ${process.env.GROQ_MODEL || "openai/gpt-oss-20b"}`);
});
