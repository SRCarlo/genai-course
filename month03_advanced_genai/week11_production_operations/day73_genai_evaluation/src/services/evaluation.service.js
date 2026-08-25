import "dotenv/config";

import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";

import { loadDataset } from "../datasets/dataset.loader.js";

import { generateAnswer } from "./llm.service.js";

import { evaluateAnswer, evaluateRetrieval } from "../evaluation/evaluator.js";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, "../../");

const resultsDirectory = path.join(projectRoot, "results");

async function ensureResultsDirectory() {
  await fs.mkdir(resultsDirectory, {
    recursive: true,
  });
}

export async function runEvaluation(datasetName) {
  await ensureResultsDirectory();

  const dataset = await loadDataset(datasetName);

  const runId = `eval_${randomUUID()}`;

  const startedAt = new Date().toISOString();

  const results = [];

  for (const item of dataset) {
    const generation = await generateAnswer({
      question: item.question,
      context: item.context || null,
    });

    const evaluation = await evaluateAnswer({
      question: item.question,
      expectedAnswer: item.expectedAnswer,
      actualAnswer: generation.answer,
      context: item.context || null,
    });

    results.push({
      id: item.id,

      question: item.question,

      expectedAnswer: item.expectedAnswer,

      actualAnswer: generation.answer,

      score: evaluation.overall,

      correctness: evaluation.correctness,

      relevance: evaluation.relevance,

      faithfulness: evaluation.faithfulness,

      exactMatch: evaluation.exactMatch,

      semanticSimilarity: evaluation.semanticSimilarity,

      judgeReason: evaluation.judgeReason,

      latencyMs: generation.latencyMs,

      usage: generation.usage,

      model: generation.model,
    });
  }

  const totalCases = results.length;

  const passed = results.filter(
    (result) => result.score >= Number(process.env.MIN_SCORE || 0.85),
  ).length;

  const failed = totalCases - passed;

  const averageScore =
    totalCases === 0
      ? 0
      : results.reduce((sum, result) => sum + result.score, 0) / totalCases;

  const averageLatency =
    totalCases === 0
      ? 0
      : results.reduce((sum, result) => sum + result.latencyMs, 0) / totalCases;

  const report = {
    runId,

    dataset: datasetName,

    datasetVersion: process.env.DATASET_VERSION || "v1",

    promptVersion: process.env.PROMPT_VERSION || "v1",

    modelVersion: process.env.MODEL_VERSION || process.env.GROQ_MODEL,

    evaluatorVersion: process.env.EVALUATOR_VERSION || "v1",

    startedAt,

    completedAt: new Date().toISOString(),

    totalCases,

    passed,

    failed,

    averageScore: Number(averageScore.toFixed(4)),

    averageLatencyMs: Number(averageLatency.toFixed(2)),

    threshold: Number(process.env.MIN_SCORE || 0.85),

    status:
      averageScore >= Number(process.env.MIN_SCORE || 0.85) ? "PASS" : "FAIL",

    results,
  };

  const filePath = path.join(resultsDirectory, `${runId}.json`);

  await fs.writeFile(filePath, JSON.stringify(report, null, 2));

  return report;
}

export async function runRegression() {
  return runEvaluation("regression");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dataset = process.argv[2] || "basic";

  try {
    const report = await runEvaluation(dataset);

    console.log(JSON.stringify(report, null, 2));

    if (report.status === "FAIL") {
      process.exitCode = 1;
    }
  } catch (error) {
    console.error(error);

    process.exitCode = 1;
  }
}
