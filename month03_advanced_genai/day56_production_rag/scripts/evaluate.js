import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import { hybridSearch } from "../backend/services/hybridSearchService.js";
import { rerank } from "../backend/services/rerankerService.js";

import {
  calculateHitAtK,
  calculateRecallAtK,
  calculateMRR,
} from "../backend/services/evaluationService.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QUESTIONS_PATH = path.resolve(__dirname, "../evaluation/questions.json");

const RESULTS_PATH = path.resolve(__dirname, "../evaluation/results.json");

async function evaluate() {
  const questions = JSON.parse(await fs.readFile(QUESTIONS_PATH, "utf-8"));

  const results = [];

  for (const item of questions) {
    console.log(`Evaluating: ${item.question}`);

    const start = Date.now();

    const hybrid = await hybridSearch(item.question);

    const reranked = await rerank(item.question, hybrid);

    const sources = reranked.map((doc) => ({
      source: doc.source,
    }));

    const hitAt5 = calculateHitAtK(sources, item.expectedSources, 5);

    const recallAt5 = calculateRecallAtK(sources, item.expectedSources, 5);

    const mrr = calculateMRR(sources, item.expectedSources);

    results.push({
      question: item.question,
      expectedSources: item.expectedSources,
      retrievedSources: sources.map((source) => source.source),
      hitAt5,
      recallAt5,
      mrr,
      latencyMs: Date.now() - start,
    });
  }

  const average = (values) =>
    values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1);

  const summary = {
    questions: results.length,

    hitAt5: average(results.map((result) => result.hitAt5)),

    recallAt5: average(results.map((result) => result.recallAt5)),

    mrr: average(results.map((result) => result.mrr)),

    averageLatencyMs: average(results.map((result) => result.latencyMs)),
  };

  const output = {
    generatedAt: new Date().toISOString(),

    summary,

    results,
  };

  await fs.writeFile(RESULTS_PATH, JSON.stringify(output, null, 2));

  console.log("\nEvaluation complete.");
  console.log(summary);
}

evaluate().catch((error) => {
  console.error("Evaluation failed:", error);

  process.exit(1);
});
