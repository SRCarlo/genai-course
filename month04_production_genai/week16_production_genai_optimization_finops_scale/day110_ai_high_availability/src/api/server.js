import express from "express";
import { config, validateConfig } from "../config/config.js";
import { healthRoutes } from "../health/health.js";
import { GroqProvider } from "../ai/groq-provider.js";
import { createHealthyProvider } from "../ai/mock-providers.js";
import { AIGateway } from "../ai/ai-gateway.js";
import { CircuitBreaker } from "../resilience/circuit-breaker.js";
import { timeout } from "../resilience/timeout.js";
import { retry } from "../resilience/retry.js";
import { setupGracefulShutdown } from "../shutdown/graceful-shutdown.js";

validateConfig();

const app = express();

app.use(express.json());

// --------------------------------------------------
// Health Routes
// --------------------------------------------------

healthRoutes(app);

// --------------------------------------------------
// Root Route
// --------------------------------------------------

app.get("/", (req, res) => {
  res.json({
    service: "day110-ai-high-availability",
    status: "running",
    model: config.groqModel,
  });
});

// --------------------------------------------------
// Primary Groq Provider
// --------------------------------------------------

let primaryProvider;

try {
  primaryProvider = new GroqProvider();
} catch (error) {
  console.warn("Groq provider unavailable:", error.message);

  primaryProvider = createHealthyProvider(
    "Primary Groq provider is not configured.",
  );
}

// --------------------------------------------------
// Fallback Provider
// --------------------------------------------------

const fallbackProvider = createHealthyProvider("This is a fallback response.");

// --------------------------------------------------
// Circuit Breaker
// --------------------------------------------------

const circuitBreaker = new CircuitBreaker({
  failureThreshold: config.circuitFailureThreshold,
  resetTimeout: config.circuitResetTimeout,
});

// --------------------------------------------------
// AI Gateway
// --------------------------------------------------

const aiGateway = new AIGateway({
  primary: {
    async generate(input) {
      return timeout(() => primaryProvider.generate(input), config.aiTimeoutMs);
    },
  },

  fallback: fallbackProvider,

  timeoutMs: config.aiTimeoutMs,

  circuitBreaker,
});

// --------------------------------------------------
// Generate API
// --------------------------------------------------

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        error: "prompt is required",
      });
    }

    const result = await aiGateway.generate(prompt);

    return res.status(200).json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Generate error:", error);

    return res.status(503).json({
      success: false,
      error: "AI service temporarily unavailable",
      message: error.message,
    });
  }
});

// --------------------------------------------------
// TEST 9 - Retry Endpoint
// --------------------------------------------------

let retryAttempts = 0;

app.get("/api/test-retry", async (req, res) => {
  retryAttempts = 0;

  try {
    const result = await retry(
      async () => {
        retryAttempts++;

        console.log(`Retry test attempt: ${retryAttempts}`);

        if (retryAttempts < 3) {
          throw new Error(`Simulated failure on attempt ${retryAttempts}`);
        }

        return {
          message: "Retry succeeded",
          attempts: retryAttempts,
        };
      },
      {
        retries: config.retryCount,
        baseDelay: config.retryBaseDelay,
      },
    );

    return res.status(200).json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Retry test failed:", error.message);

    return res.status(503).json({
      success: false,
      error: error.message,
      attempts: retryAttempts,
    });
  }
});

// --------------------------------------------------
// Start Server
// --------------------------------------------------

const server = app.listen(config.port, () => {
  console.log(`AI API running on port ${config.port}`);

  console.log(`Model: ${config.groqModel}`);

  console.log(`Retry Count: ${config.retryCount}`);

  console.log(`Retry Base Delay: ${config.retryBaseDelay}ms`);
});

// --------------------------------------------------
// Graceful Shutdown
// --------------------------------------------------

setupGracefulShutdown({
  server,

  onShutdown: async () => {
    console.log("Closing application resources...");

    // Place database / Redis / queue cleanup here
    // when those resources are added.

    console.log("Application resources closed");
  },
});
