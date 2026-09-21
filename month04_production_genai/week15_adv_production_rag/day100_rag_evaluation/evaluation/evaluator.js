import fs from "node:fs/promises";
import dotenv from "dotenv";
import { documents } from "../src/ai/retrieval/documents.js";
import { hybridSearch } from "../src/ai/retrieval/hybrid-search.js";
import { vectorSearch } from "../src/ai/retrieval/vector-search.js";
import { chat } from "../src/application/chat.service.js";
import {
  recallAtK,
  precisionAtK,
  reciprocalRank,
  mean,
} from "./retrieval.metrics.js";
import {
  calculateKeywordCoverage,
  calculateContextRelevance,
} from "./answer.metrics.js";
import { runQualityGate } from "./quality-gate.js";
import { judgeAnswer } from "../src/ai/llm/groq.client.js";

dotenv.config();

const dataset = JSON.parse(
  await fs.readFile(new URL("./dataset.json", import.meta.url), "utf8"),
);

const useJudge = process.argv.includes("--judge");
const k = 5;

async function evaluateCase(item) {
  const vectorStart = Date.now();
  const vectorResults = vectorSearch(item.question, documents, k);
  const vectorLatencyMs = Date.now() - vectorStart;

  const hybridStart = Date.now();
  const hybrid = hybridSearch(item.question, documents, k);
  const hybridLatencyMs = Date.now() - hybridStart;

  let answerResult = null;
  let judge = null;
  let error = null;

  const ragStart = Date.now();

  try {
    answerResult = await chat(item.question);

    if (useJudge && answerResult.answer) {
      judge = await judgeAnswer({
        question: item.question,
        context: answerResult.context || "",
        answer: answerResult.answer,
      });
    }
  } catch (err) {
    error = err.message;
  }

  const totalLatencyMs = Date.now() - ragStart;

  const vectorIds = vectorResults.map((doc) => doc.id);
  const hybridIds = hybrid.results.map((doc) => doc.id);

  const retrieval = {
    vector: {
      recallAt5: recallAtK(vectorIds, item.relevantDocuments, k),
      precisionAt5: precisionAtK(vectorIds, item.relevantDocuments, k),
      mrr: reciprocalRank(vectorIds, item.relevantDocuments),
      latencyMs: vectorLatencyMs,
    },
    hybrid: {
      recallAt5: recallAtK(hybridIds, item.relevantDocuments, k),
      precisionAt5: precisionAtK(hybridIds, item.relevantDocuments, k),
      mrr: reciprocalRank(hybridIds, item.relevantDocuments),
      latencyMs: hybridLatencyMs,
    },
  };

  const generation = {
    answerRelevance: calculateKeywordCoverage(
      answerResult?.answer || "",
      item.expectedAnswerTopics,
    ),
    contextRelevance: calculateContextRelevance(
      item.question,
      answerResult?.retrievedDocuments?.map((r) => ({
        title: r.title,
        text: documents.find((d) => d.id === r.id)?.text || "",
      })) || [],
    ),
    faithfulness: judge?.faithfulness ?? null,
  };

  return {
    id: item.id,
    question: item.question,
    category: item.category,
    difficulty: item.difficulty,
    retrieval,
    generation,
    system: {
      latencyMs: totalLatencyMs,
      inputTokens: answerResult?.usage?.inputTokens ?? 0,
      outputTokens: answerResult?.usage?.outputTokens ?? 0,
      totalTokens: answerResult?.usage?.totalTokens ?? 0,
      costUsd: answerResult?.costUsd ?? 0,
      requestId: answerResult?.requestId ?? null,
    },
    answer: answerResult?.answer || "",
    retrievedDocuments: answerResult?.retrievedDocuments || [],
    judge,
    error,
  };
}

const results = [];

for (const item of dataset) {
  process.stdout.write(`Evaluating ${item.id}...\n`);
  results.push(await evaluateCase(item));
}

const retrievalHybrid = {
  recallAt5: mean(results.map((r) => r.retrieval.hybrid.recallAt5)),
  precisionAt5: mean(results.map((r) => r.retrieval.hybrid.precisionAt5)),
  mrr: mean(results.map((r) => r.retrieval.hybrid.mrr)),
};

const generation = {
  answerRelevance: mean(results.map((r) => r.generation.answerRelevance)),
  contextRelevance: mean(results.map((r) => r.generation.contextRelevance)),
  faithfulness: useJudge
    ? mean(results.map((r) => r.generation.faithfulness ?? 0))
    : null,
};

const system = {
  avgLatencyMs: mean(results.map((r) => r.system.latencyMs)),
  avgInputTokens: mean(results.map((r) => r.system.inputTokens)),
  avgOutputTokens: mean(results.map((r) => r.system.outputTokens)),
  totalTokens: results.reduce((sum, r) => sum + r.system.totalTokens, 0),
  totalCostUsd: results.reduce((sum, r) => sum + r.system.costUsd, 0),
};

const qualityMetrics = {
  recallAt5: retrievalHybrid.recallAt5,
  precisionAt5: retrievalHybrid.precisionAt5,
  faithfulness: generation.faithfulness ?? 0,
  answerRelevance: generation.answerRelevance,
};

const qualityGate = runQualityGate(qualityMetrics);

const report = {
  generatedAt: new Date().toISOString(),
  model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
  judgeEnabled: useJudge,
  retrieval: {
    hybrid: retrievalHybrid,
  },
  generation,
  system,
  qualityGate,
  failures: results
    .filter((r) => r.error)
    .map((r) => ({
      id: r.id,
      error: r.error,
    })),
  cases: results,
};

await fs.writeFile(
  new URL("./report.json", import.meta.url),
  JSON.stringify(report, null, 2),
);

console.log("\n=== DAY 100 EVALUATION ===");
console.log(
  JSON.stringify(
    {
      retrieval: retrievalHybrid,
      generation,
      system,
      qualityGate,
    },
    null,
    2,
  ),
);

if (process.argv.includes("--quality-gate") && !qualityGate.passed) {
  process.exitCode = 1;
}
