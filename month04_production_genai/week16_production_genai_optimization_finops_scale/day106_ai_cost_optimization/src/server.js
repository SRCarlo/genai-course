import express from "express";
import crypto from "node:crypto";

import { calculateCost } from "./cost/cost-calculator.js";
import { createCostEvent } from "./cost/cost-event.js";
import { checkBudget } from "./cost/cost-guard.js";
import { chooseModel } from "./cost/model-router.js";
import { generateWithGroq } from "./ai/groq-client.js";

const app = express();

const PORT = process.env.PORT || 5000;

/*
|--------------------------------------------------------------------------
| Retry Cost Calculator
|--------------------------------------------------------------------------
*/

function calculateRetryCost({
  inputTokens,
  outputTokens,
  inputPricePerMillion,
  outputPricePerMillion,
  attempts,
}) {
  const inputCost = (inputTokens / 1_000_000) * inputPricePerMillion;

  const outputCost = (outputTokens / 1_000_000) * outputPricePerMillion;

  const singleAttemptCost = inputCost + outputCost;

  return {
    singleAttemptCost,
    attempts,
    totalCost: singleAttemptCost * attempts,
    retryCost: singleAttemptCost * Math.max(0, attempts - 1),
  };
}

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/

app.use(express.json());

/*
|--------------------------------------------------------------------------
| In-Memory Stores
|--------------------------------------------------------------------------
*/

const costEvents = [];

const embeddingCache = new Map();

const semanticCache = new Map();

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function createRequestId() {
  return crypto.randomUUID();
}

function normalizeQuery(query) {
  return String(query || "")
    .trim()
    .toLowerCase();
}

function createSemanticCacheKey({ tenantId, userScope = "default", query }) {
  return crypto
    .createHash("sha256")
    .update(
      JSON.stringify({
        tenantId,
        userScope,
        query: normalizeQuery(query),
      }),
    )
    .digest("hex");
}

/*
|--------------------------------------------------------------------------
| Health
|--------------------------------------------------------------------------
*/

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "day106-ai-cost-optimization",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

/*
|--------------------------------------------------------------------------
| Cost Calculator
|--------------------------------------------------------------------------
*/

app.post("/api/cost/calculate", (req, res) => {
  try {
    const {
      inputTokens,
      outputTokens,
      inputPricePerMillion,
      outputPricePerMillion,
    } = req.body;

    if (
      inputTokens === undefined ||
      outputTokens === undefined ||
      inputPricePerMillion === undefined ||
      outputPricePerMillion === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "inputTokens, outputTokens, inputPricePerMillion and outputPricePerMillion are required",
      });
    }

    const result = calculateCost({
      inputTokens: Number(inputTokens),
      outputTokens: Number(outputTokens),
      inputPricePerMillion: Number(inputPricePerMillion),
      outputPricePerMillion: Number(outputPricePerMillion),
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Cost Event
|--------------------------------------------------------------------------
*/

app.post("/api/cost/event", (req, res) => {
  try {
    const { requestId, tenantId, model, inputTokens, outputTokens, cost } =
      req.body;

    if (
      !tenantId ||
      !model ||
      inputTokens === undefined ||
      outputTokens === undefined ||
      cost === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "tenantId, model, inputTokens, outputTokens and cost are required",
      });
    }

    const event = createCostEvent({
      requestId: requestId || createRequestId(),
      tenantId,
      model,
      inputTokens: Number(inputTokens),
      outputTokens: Number(outputTokens),
      cost: Number(cost),
    });

    costEvents.push(event);

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Get Cost Events
|--------------------------------------------------------------------------
*/

app.get("/api/cost/events", (req, res) => {
  res.json({
    success: true,
    count: costEvents.length,
    data: costEvents,
  });
});

/*
|--------------------------------------------------------------------------
| Budget Check
|--------------------------------------------------------------------------
*/

app.post("/api/budget/check", (req, res) => {
  try {
    const { currentCost, requestCost, budget } = req.body;

    if (
      currentCost === undefined ||
      requestCost === undefined ||
      budget === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "currentCost, requestCost and budget are required",
      });
    }

    const result = checkBudget({
      currentCost: Number(currentCost),
      requestCost: Number(requestCost),
      budget: Number(budget),
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Model Router
|--------------------------------------------------------------------------
*/

app.post("/api/router/choose", (req, res) => {
  try {
    const { complexity, maxBudget } = req.body;

    if (!complexity) {
      return res.status(400).json({
        success: false,
        message: "complexity is required",
      });
    }

    const model = chooseModel({
      complexity: String(complexity).toUpperCase(),
      maxBudget: maxBudget === undefined ? undefined : Number(maxBudget),
    });

    res.json({
      success: true,
      data: {
        complexity: String(complexity).toUpperCase(),
        model,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Retry Cost
|--------------------------------------------------------------------------
*/

app.post("/api/retry/calculate", (req, res) => {
  try {
    const {
      inputTokens,
      outputTokens,
      inputPricePerMillion,
      outputPricePerMillion,
      attempts,
    } = req.body;

    if (
      inputTokens === undefined ||
      outputTokens === undefined ||
      inputPricePerMillion === undefined ||
      outputPricePerMillion === undefined ||
      attempts === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "inputTokens, outputTokens, inputPricePerMillion, outputPricePerMillion and attempts are required",
      });
    }

    const result = calculateRetryCost({
      inputTokens: Number(inputTokens),
      outputTokens: Number(outputTokens),
      inputPricePerMillion: Number(inputPricePerMillion),
      outputPricePerMillion: Number(outputPricePerMillion),
      attempts: Number(attempts),
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Embedding Cache Simulation
|--------------------------------------------------------------------------
*/

app.post("/api/cache/embedding", (req, res) => {
  try {
    const { documentId, content } = req.body;

    if (!documentId || !content) {
      return res.status(400).json({
        success: false,
        message: "documentId and content are required",
      });
    }

    const hash = crypto.createHash("sha256").update(content).digest("hex");

    const cacheKey = `${documentId}:${hash}`;

    if (embeddingCache.has(cacheKey)) {
      return res.json({
        success: true,
        cached: true,
        message: "Embedding cache hit",
        data: embeddingCache.get(cacheKey),
      });
    }

    const embeddingRecord = {
      documentId,
      hash,
      createdAt: new Date().toISOString(),
      simulated: true,
    };

    embeddingCache.set(cacheKey, embeddingRecord);

    res.json({
      success: true,
      cached: false,
      message: "Embedding created and stored in cache",
      data: embeddingRecord,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Semantic Cache
|--------------------------------------------------------------------------
*/

app.post("/api/cache/semantic", (req, res) => {
  try {
    const {
      action,
      tenantId,
      userScope = "default",
      query,
      response,
    } = req.body;

    if (!tenantId || !query) {
      return res.status(400).json({
        success: false,
        message: "tenantId and query are required",
      });
    }

    const key = createSemanticCacheKey({
      tenantId,
      userScope,
      query,
    });

    /*
    |----------------------------------------------------------------------
    | SET
    |----------------------------------------------------------------------
    */

    if (action === "set") {
      if (response === undefined) {
        return res.status(400).json({
          success: false,
          message: "response is required when action is set",
        });
      }

      const record = {
        tenantId,
        userScope,
        query: normalizeQuery(query),
        response,
        createdAt: new Date().toISOString(),
      };

      semanticCache.set(key, record);

      return res.json({
        success: true,
        cached: true,
        action: "set",
        key,
        data: record,
      });
    }

    /*
    |----------------------------------------------------------------------
    | GET
    |----------------------------------------------------------------------
    */

    if (action === "get") {
      const record = semanticCache.get(key);

      if (!record) {
        return res.json({
          success: true,
          cached: false,
          action: "get",
          data: null,
        });
      }

      return res.json({
        success: true,
        cached: true,
        action: "get",
        data: record,
      });
    }

    return res.status(400).json({
      success: false,
      message: 'action must be either "set" or "get"',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Groq Chat
|--------------------------------------------------------------------------
*/

app.post("/api/groq/chat", async (req, res) => {
  try {
    const { message, systemPrompt, temperature, maxTokens } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "message is required",
      });
    }

    const result = await generateWithGroq({
      message,
      systemPrompt,
      temperature,
      maxTokens,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Groq API error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| 404
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/*
|--------------------------------------------------------------------------
| Error Handler
|--------------------------------------------------------------------------
*/

app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

app.listen(PORT, () => {
  console.log("");
  console.log("==============================================");
  console.log(" Day 106 AI Cost Optimization API");
  console.log("==============================================");
  console.log(`Server running on: http://localhost:${PORT}`);
  console.log("");
  console.log("Available endpoints:");
  console.log("GET  /api/health");
  console.log("POST /api/cost/calculate");
  console.log("POST /api/cost/event");
  console.log("GET  /api/cost/events");
  console.log("POST /api/budget/check");
  console.log("POST /api/router/choose");
  console.log("POST /api/retry/calculate");
  console.log("POST /api/cache/embedding");
  console.log("POST /api/cache/semantic");
  console.log("POST /api/groq/chat");
  console.log("==============================================");
  console.log("");
});
