import { config } from "./config.js";
import {
  calculateCost,
  calculateRetryCost
} from "./cost/cost-calculator.js";
import { chooseGroqModel } from "./cost/model-router.js";
import { checkBudget } from "./cost/cost-guard.js";
import { createCostEvent } from "./cost/cost-event.js";
import { createEmbeddingCache } from "./cost/embedding-cache.js";
import { createSemanticCache } from "./cost/semantic-cache.js";
import { shouldCompress } from "./cost/conversation-compressor.js";
import { canRetry } from "./cost/retry-budget.js";
import { generateWithGroq, buildUserMessage } from "./ai/groq-client.js";

console.log("\n=== DAY 106 — AI COST OPTIMIZATION ===\n");

console.log("Groq model:", config.groqModel);
console.log("Live Groq enabled:", config.enableLiveGroq);

const cost = calculateCost({
  inputTokens: 2000,
  outputTokens: 500,
  inputPricePerMillion: config.inputPricePerMillion,
  outputPricePerMillion: config.outputPricePerMillion
});

console.log("\n1. Cost calculator");
console.log(cost);

console.log("\n2. Model router");
console.log(
  chooseGroqModel({
    complexity: "HIGH"
  })
);

console.log("\n3. Budget guard");
console.log(
  checkBudget({
    currentCost: 4,
    requestCost: cost.totalCost,
    budget: config.dailyBudget
  })
);

console.log("\n4. Retry economics");
console.log(
  calculateRetryCost({
    attempts: 3,
    inputTokens: 2000,
    outputTokens: 500,
    inputPricePerMillion: config.inputPricePerMillion,
    outputPricePerMillion: config.outputPricePerMillion
  })
);

console.log("\n5. Retry budget");
console.log(
  "Can retry:",
  canRetry(0, config.maxRetries)
);

console.log("\n6. Embedding cache");
const embeddingCache = createEmbeddingCache();

const fakeEmbedding = async text =>
  Array.from({ length: 8 }, (_, index) =>
    (text.length + index) / 100
  );

console.log(
  await embeddingCache.getEmbedding(
    "Day 106 AI FinOps",
    fakeEmbedding
  )
);

console.log(
  await embeddingCache.getEmbedding(
    "Day 106 AI FinOps",
    fakeEmbedding
  )
);

console.log("\n7. Semantic cache");
const semanticCache = createSemanticCache({
  threshold: 0.6
});

semanticCache.set({
  tenantId: "tenant-1",
  userScope: "support",
  query: "What is your refund policy?",
  response: "Our refund policy allows eligible refunds according to the plan terms.",
  promptVersion: "v1",
  modelVersion: config.groqModel,
  knowledgeVersion: "kb-v1"
});

console.log(
  semanticCache.get({
    tenantId: "tenant-1",
    userScope: "support",
    query: "What's the refund policy?",
    promptVersion: "v1",
    modelVersion: config.groqModel,
    knowledgeVersion: "kb-v1"
  })
);

console.log("\n8. Conversation compression");
console.log(
  shouldCompress({
    tokenCount: 6500,
    threshold: config.maxContextTokens
  })
);

const event = createCostEvent({
  requestId: "req-demo-001",
  tenantId: "tenant-1",
  userId: "user-1",
  application: "day106-demo",
  feature: "cost-demo",
  workflow: "chat",
  model: config.groqModel,
  inputTokens: 2000,
  outputTokens: 500,
  cost: cost.totalCost,
  cacheHit: false,
  retryCount: 0,
  toolCalls: 0
});

console.log("\n9. Cost event");
console.log(event);

if (config.enableLiveGroq) {
  console.log("\n10. Calling Groq...");
  const result = await generateWithGroq({
    messages: [
      buildUserMessage(
        "Explain AI FinOps in 3 short bullet points."
      )
    ],
    maxTokens: 200
  });

  console.log("Model:", result.model);
  console.log("Answer:", result.text);
  console.log("Usage:", result.usage);

  const liveCost = calculateCost({
    inputTokens: result.usage.inputTokens,
    outputTokens: result.usage.outputTokens,
    inputPricePerMillion: config.inputPricePerMillion,
    outputPricePerMillion: config.outputPricePerMillion
  });

  console.log("Estimated live request cost:", liveCost);
} else {
  console.log(
    "\n10. Live Groq call skipped. Set ENABLE_LIVE_GROQ=true to test it."
  );
}