import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { DocumentStore } from "../ingestion/document.store.js";
import { TfidfIndex } from "../retrieval/tfidf.js";
import { VectorRetriever } from "../retrieval/vector.retriever.js";
import { KeywordRetriever } from "../retrieval/keyword.retriever.js";
import { HybridRetriever } from "../retrieval/hybrid.retriever.js";
import { Reranker } from "../retrieval/reranker.js";
import { QueryRewriter } from "../query/query.rewriter.js";
import { ContextBuilder } from "../context/context.builder.js";
import { GroqClient } from "../llm/groq.client.js";
import { RagService } from "../rag/rag.service.js";

import { evaluateRetrieval } from "./retrieval.evaluator.js";

import {
  evaluateContextRelevance,
  evaluateFaithfulness,
  evaluateCorrectness
} from "./answer.evaluator.js";

import {
  mean,
  percentile
} from "./metrics.js";

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

const datasetPath = path.resolve(
  __dirname,
  "../../tests/evaluation.dataset.json"
);

async function loadDataset() {
  const content =
    await fs.readFile(
      datasetPath,
      "utf-8"
    );

  return JSON.parse(content);
}

export async function buildRagSystem() {
  const store =
    new DocumentStore();

  const documents =
    store.getAll();

  const index =
    new TfidfIndex(documents);

  const vectorRetriever =
    new VectorRetriever(index);

  const keywordRetriever =
    new KeywordRetriever(
      documents
    );

  const hybridRetriever =
    new HybridRetriever({
      vectorRetriever,
      keywordRetriever
    });

  const reranker =
    new Reranker();

  const queryRewriter =
    new QueryRewriter();

  const contextBuilder =
    new ContextBuilder();

  const llm =
    new GroqClient();

  return new RagService({
    queryRewriter,
    vectorRetriever,
    keywordRetriever,
    hybridRetriever,
    reranker,
    contextBuilder,
    llm
  });
}

export async function runEvaluation() {
  const dataset =
    await loadDataset();

  const ragSystem =
    await buildRagSystem();

  const results = [];

  for (const test of dataset) {
    console.log(
      `Evaluating ${test.id}: ${test.question}`
    );

    try {
      const output =
        await ragSystem.query(
          test.question
        );

      const retrieved =
        output.trace.retrieval
          .rerankedResults;

      const retrieval =
        evaluateRetrieval({
          results: retrieved,
          relevantDocuments:
            test.relevantDocuments
        });

      const context =
        output.trace.context.text;

      const contextRelevance =
        evaluateContextRelevance({
          question: test.question,
          context
        });

      const faithfulness =
        evaluateFaithfulness({
          answer: output.answer,
          context
        });

      const correctness =
        evaluateCorrectness({
          answer: output.answer,
          expectedAnswer:
            test.expectedAnswer
        });

      results.push({
        id: test.id,
        question: test.question,
        retrieval,
        contextRelevance,
        faithfulness,
        correctness,

        latencyMs:
          output.trace
            .totalLatencyMs,

        inputTokens:
          output.trace.generation
            .inputTokens,

        outputTokens:
          output.trace.generation
            .outputTokens,

        totalCost:
          output.trace.cost
            .totalCost,

        answer: output.answer
      });
    } catch (error) {
      results.push({
        id: test.id,
        question: test.question,
        error: error.message
      });
    }
  }

  const successful =
    results.filter(
      (result) => !result.error
    );

  const report = {
    totalQuestions:
      results.length,

    successfulQuestions:
      successful.length,

    failedQuestions:
      results.length -
      successful.length,

    retrieval: {
      recallAt3: mean(
        successful.map(
          (item) =>
            item.retrieval.recallAt3
        )
      ),

      recallAt5: mean(
        successful.map(
          (item) =>
            item.retrieval.recallAt5
        )
      ),

      recallAt10: mean(
        successful.map(
          (item) =>
            item.retrieval.recallAt10
        )
      ),

      precisionAt3: mean(
        successful.map(
          (item) =>
            item.retrieval
              .precisionAt3
        )
      ),

      precisionAt5: mean(
        successful.map(
          (item) =>
            item.retrieval
              .precisionAt5
        )
      ),

      mrr: mean(
        successful.map(
          (item) =>
            item.retrieval.mrr
        )
      )
    },

    generation: {
      contextRelevance:
        mean(
          successful.map(
            (item) =>
              item.contextRelevance
          )
        ),

      faithfulness:
        mean(
          successful.map(
            (item) =>
              item.faithfulness
          )
        ),

      correctness:
        mean(
          successful.map(
            (item) =>
              item.correctness
          )
        )
    },

    latency: {
      p50: percentile(
        successful.map(
          (item) =>
            item.latencyMs
        ),
        50
      ),

      p95: percentile(
        successful.map(
          (item) =>
            item.latencyMs
        ),
        95
      ),

      p99: percentile(
        successful.map(
          (item) =>
            item.latencyMs
        ),
        99
      )
    },

    usage: {
      averageInputTokens:
        mean(
          successful.map(
            (item) =>
              item.inputTokens
          )
        ),

      averageOutputTokens:
        mean(
          successful.map(
            (item) =>
              item.outputTokens
          )
        ),

      totalCost:
        successful.reduce(
          (sum, item) =>
            sum + item.totalCost,
          0
        )
    },

    results
  };

  return report;
}

if (
  process.argv[1] ===
  fileURLToPath(import.meta.url)
) {
  const report =
    await runEvaluation();

  console.log(
    JSON.stringify(
      report,
      null,
      2
    )
  );
}