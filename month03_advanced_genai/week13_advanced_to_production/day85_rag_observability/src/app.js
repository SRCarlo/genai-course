import express from "express";

import { env } from "./config/env.js";

import { DocumentStore } from "./ingestion/document.store.js";

import { TfidfIndex } from "./retrieval/tfidf.js";
import { VectorRetriever } from "./retrieval/vector.retriever.js";
import { KeywordRetriever } from "./retrieval/keyword.retriever.js";
import { HybridRetriever } from "./retrieval/hybrid.retriever.js";
import { Reranker } from "./retrieval/reranker.js";

import { QueryRewriter } from "./query/query.rewriter.js";

import { ContextBuilder } from "./context/context.builder.js";

import { GroqClient } from "./llm/groq.client.js";

import { RagService } from "./rag/rag.service.js";

import { runEvaluation } from "./evaluation/evaluation.runner.js";

import { createRagRoutes } from "./routes/rag.routes.js";
import { createEvaluationRoutes } from "./routes/evaluation.routes.js";
import { createHealthRoutes } from "./routes/health.routes.js";

import { requestMiddleware } from "./middleware/request.middleware.js";

const app = express();

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(requestMiddleware);

const documentStore = new DocumentStore();

const documents = documentStore.getAll();

const tfidfIndex = new TfidfIndex(documents);

const vectorRetriever = new VectorRetriever(tfidfIndex);

const keywordRetriever = new KeywordRetriever(documents);

const hybridRetriever = new HybridRetriever({
  vectorRetriever,
  keywordRetriever,
});

const reranker = new Reranker();

const queryRewriter = new QueryRewriter();

const contextBuilder = new ContextBuilder();

const groqClient = new GroqClient();

const ragService = new RagService({
  queryRewriter,
  vectorRetriever,
  keywordRetriever,
  hybridRetriever,
  reranker,
  contextBuilder,
  llm: groqClient,
});

app.use("/api/rag", createRagRoutes(ragService));

app.use("/api/evaluation", createEvaluationRoutes(runEvaluation));

app.use(createHealthRoutes());

app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    error: "Internal server error",
  });
});

app.listen(env.port, () => {
  console.log(
    `
========================================
DAY 85 RAG OBSERVABILITY API
========================================

Server:
http://localhost:${env.port}

Model:
${env.groqModel}

Endpoints:

GET  /health

POST /api/rag/query

POST /api/evaluation/run

GET  /api/evaluation/metrics

========================================
`,
  );
});
