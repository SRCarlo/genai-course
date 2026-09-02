import express from "express";

import { env } from "./src/config/env.js";

import { Router } from "./src/orchestration/router.js";

import { AgentExecutor } from "./src/orchestration/executor.js";

import { ApprovalManager } from "./src/orchestration/approval.js";

import { createAgentRoutes } from "./src/routes/agent.routes.js";

import { SupervisorAgent } from "./src/agents/supervisor.agent.js";

import { ResearcherAgent } from "./src/agents/researcher.agent.js";

import { FallbackResearcherAgent } from "./src/agents/fallback-researcher.agent.js";

import { CoderAgent } from "./src/agents/coder.agent.js";

import { ReviewerAgent } from "./src/agents/reviewer.agent.js";

import { SecurityAgent } from "./src/agents/security.agent.js";

import { PerformanceAgent } from "./src/agents/performance.agent.js";

import { AggregatorAgent } from "./src/agents/aggregator.agent.js";

const app = express();

app.use(express.json());

// =================================
// CREATE AGENTS
// =================================

const supervisor = new SupervisorAgent();

const researcher = new ResearcherAgent();

const fallbackResearcher = new FallbackResearcherAgent();

const coder = new CoderAgent();

const reviewer = new ReviewerAgent();

const security = new SecurityAgent();

const performance = new PerformanceAgent();

const aggregator = new AggregatorAgent();

// =================================
// ROUTER
// =================================

const router = new Router();

router
  .register("supervisor", supervisor)

  .register("researcher", researcher)

  .register("fallback-researcher", fallbackResearcher)

  .register("coder", coder)

  .register("reviewer", reviewer)

  .register("security", security)

  .register("performance", performance)

  .register("aggregator", aggregator);

// =================================
// EXECUTOR
// =================================

const executor = new AgentExecutor({
  router,

  maxAttempts: 3,

  timeoutMs: 30000,
});

// =================================
// APPROVAL
// =================================

const approvalManager = new ApprovalManager();

// =================================
// ROUTES
// =================================

app.use(
  "/api/agents",
  createAgentRoutes({
    executor,

    approvalManager,

    router,
  }),
);

// =================================
// HEALTH
// =================================

app.get("/health", (req, res) => {
  res.json({
    status: "ok",

    model: env.model,

    agents: router.list(),
  });
});

// =================================
// 404
// =================================

app.use((req, res) => {
  res.status(404).json({
    success: false,

    error: "Route not found",
  });
});

// =================================
// SERVER
// =================================

app.listen(env.port, () => {
  console.log(`Day 81 server running on http://localhost:${env.port}`);

  console.log(`Groq model: ${env.model}`);

  console.log("Registered agents:");

  console.log(router.list());
});
