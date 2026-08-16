import "dotenv/config";

import fs from "node:fs/promises";

import { runDay63Application } from "./day63Adapter.js";

import {
  evaluateRetrieval,
  evaluateTopK,
} from "../evaluator/retrievalEvaluator.js";

import { evaluateAnswer } from "../evaluator/answerEvaluator.js";

import { evaluateFaithfulness } from "../evaluator/faithfulnessEvaluator.js";

import { evaluateAgent } from "../evaluator/agentEvaluator.js";

import { generateReport } from "../metrics/report.js";

const questions = JSON.parse(
  await fs.readFile("dataset/questions.json", "utf8"),
);

const useLLMJudge = process.env.EVALUATION_USE_LLM_JUDGE !== "false";

const maxIterations = Number(process.env.MAX_AGENT_ITERATIONS || 8);

function getVersion() {
  const argument = process.argv.find((arg) => arg.startsWith("--version="));

  if (!argument) {
    return "v1";
  }

  return argument.split("=")[1];
}

function hasExpectedSource(testCase) {
  return Boolean(testCase.expectedSource);
}

function calculatePass({
  answerEvaluation,
  retrievalEvaluation,
  agentEvaluation,
  testCase,
}) {
  const correctness = answerEvaluation.correctness;

  const relevance = answerEvaluation.relevance;

  const faithfulness = answerEvaluation.faithfulness;

  const retrievalOK =
    !hasExpectedSource(testCase) ||
    retrievalEvaluation.recall >=
      Number(process.env.RETRIEVAL_RECALL_THRESHOLD || 0.9);

  const agentOK =
    !testCase.expectedTools?.length ||
    Boolean(agentEvaluation.toolSelectionCorrect);

  const answerOK =
    correctness >= Number(process.env.CORRECTNESS_THRESHOLD || 0.9) &&
    relevance >= Number(process.env.RELEVANCE_THRESHOLD || 0.9) &&
    faithfulness >= Number(process.env.FAITHFULNESS_THRESHOLD || 0.95);

  return retrievalOK && agentOK && answerOK;
}

async function evaluateTestCase(testCase) {
  console.log(`\nEvaluating ${testCase.id}: ${testCase.question}`);

  let applicationResult;

  try {
    applicationResult = await runDay63Application(testCase.question);
  } catch (error) {
    return {
      id: testCase.id,
      category: testCase.category,
      question: testCase.question,
      expectedAnswer: testCase.expectedAnswer,
      actualAnswer: "",
      retrieved: [],
      latencyMs: 0,

      error: error.message,

      passed: false,

      failureReason: `Day 63 application failed: ${error.message}`,
    };
  }

  const retrievalEvaluation = evaluateRetrieval(
    applicationResult.retrieved,
    testCase.expectedSource,
  );

  const topK = evaluateTopK(
    applicationResult.retrieved,
    testCase.expectedSource,
  );

  const answerEvaluation = await evaluateAnswer({
    question: testCase.question,

    expectedAnswer: testCase.expectedAnswer,

    actualAnswer: applicationResult.answer,

    context: applicationResult.retrieved,

    useLLMJudge,
  });

  const faithfulnessEvaluation = await evaluateFaithfulness({
    question: testCase.question,

    answer: applicationResult.answer,

    context: applicationResult.retrieved,
  });

  answerEvaluation.faithfulness = faithfulnessEvaluation.score;

  const agentEvaluation = evaluateAgent({
    expectedTools: testCase.expectedTools || [],

    actualTools: applicationResult.toolCalls || [],

    maxIterations,

    actualIterations: applicationResult.trace?.length || 0,
  });

  const passed = calculatePass({
    answerEvaluation,
    retrievalEvaluation,
    agentEvaluation,
    testCase,
  });

  console.log(passed ? "PASS" : "FAIL");

  return {
    id: testCase.id,

    category: testCase.category,

    question: testCase.question,

    expectedAnswer: testCase.expectedAnswer,

    actualAnswer: applicationResult.answer,

    expectedSource: testCase.expectedSource,

    expectedTools: testCase.expectedTools || [],

    retrieved: applicationResult.retrieved,

    trace: applicationResult.trace,

    latencyMs: applicationResult.latencyMs,

    usage: applicationResult.usage,

    retrievalEvaluation,

    topK,

    answerEvaluation,

    faithfulnessEvaluation,

    agentEvaluation,

    passed,
  };
}

async function main() {
  console.log("_______________________________________");

  console.log("DAY 64 — LLM EVALUATION");

  console.log("_______________________________________");

  console.log(`Tests: ${questions.length}`);

  console.log(`LLM Judge: ${useLLMJudge}`);

  const results = [];

  for (const testCase of questions) {
    const result = await evaluateTestCase(testCase);

    results.push(result);
  }

  const version = getVersion();

  const report = await generateReport({
    results,
    version,
  });

  const latestPath = "results/evaluation-report.json";

  await fs.writeFile(latestPath, JSON.stringify(report, null, 2));

  console.log("\n__________________________________");

  console.log("EVALUATION SUMMARY");

  console.log("_____________________________________");

  console.log(`Total: ${report.totalTests}`);

  console.log(`Passed: ${report.passed}`);

  console.log(`Failed: ${report.failed}`);

  console.log(`Correctness: ${(report.metrics.correctness * 100).toFixed(2)}%`);

  console.log(`Relevance: ${(report.metrics.relevance * 100).toFixed(2)}%`);

  console.log(
    `Faithfulness: ${(report.metrics.faithfulness * 100).toFixed(2)}%`,
  );

  console.log(
    `Retrieval Recall: ${(report.metrics.retrievalRecall * 100).toFixed(2)}%`,
  );

  console.log(`P50 Latency: ${report.metrics.p50LatencyMs.toFixed(0)} ms`);

  console.log(`P95 Latency: ${report.metrics.p95LatencyMs.toFixed(0)} ms`);

  console.log(`Quality Gate: ${report.qualityGate.passed ? "PASS" : "FAIL"}`);

  console.log("\nReport:");

  console.log(latestPath);

  if (!report.qualityGate.passed) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("\nEvaluation failed:");

  console.error(error);

  process.exitCode = 1;
});
