import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { evaluateAnswer } from "./evaluator.js";

const currentDir = dirname(fileURLToPath(import.meta.url));
const datasetPath = resolve(currentDir, "datasets", "chat-cases.json");
const resultsPath = resolve(currentDir, "results", "latest.json");
const useGroq = process.env.EVAL_USE_GROQ === "true";

const sampleAnswers = {
  "refund-policy-001": "Customers can request a refund within 30 days of purchase.",
  "shipping-policy-001": "Standard shipping takes 3 to 5 business days.",
  "unsupported-policy-001": "The provided information does not specify whether lifetime free repairs are offered.",
  "returns-condition-001": "The provided information does not specify who pays return shipping costs.",
  "shipping-window-001": "Yes. The stated standard shipping estimate is 3 to 5 business days."
};

async function loadCases() {
  const raw = await readFile(datasetPath, "utf8");
  const cases = JSON.parse(raw);
  if (!Array.isArray(cases) || cases.length === 0) {
    throw new Error("Evaluation dataset must be a non-empty JSON array");
  }
  const ids = new Set();
  for (const testCase of cases) {
    if (!testCase || typeof testCase.id !== "string" || testCase.id.trim() === "") {
      throw new Error("Every evaluation case must have a non-empty id");
    }
    if (ids.has(testCase.id)) throw new Error(`Duplicate evaluation id: ${testCase.id}`);
    ids.add(testCase.id);
  }
  return cases;
}

async function getAnswer(testCase, client) {
  if (useGroq) {
    const { runChatEvaluation } = await import("./chat-adapter.js");
    return runChatEvaluation({ testCase, client });
  }
  const answer = sampleAnswers[testCase.id];
  if (typeof answer !== "string") {
    throw new Error(`Missing sample answer for ${testCase.id}; add a fixture or enable Groq`);
  }
  return { answer, usage: null, model: "deterministic-fixture" };
}

async function main() {
  const cases = await loadCases();
  let client;
  if (useGroq) {
    const { createGroqClient } = await import("./chat-adapter.js");
    client = createGroqClient();
  }

  const results = [];
  for (const testCase of cases) {
    try {
      const modelResult = await getAnswer(testCase, client);
      const evaluation = evaluateAnswer(testCase, modelResult.answer);
      results.push({
        ...evaluation,
        answer: modelResult.answer,
        model: modelResult.model,
        usage: modelResult.usage,
        error: null
      });
    } catch (error) {
      results.push({
        id: testCase.id,
        passed: false,
        expectedTermsPresent: false,
        abstained: false,
        abstentionCorrect: false,
        groundednessScore: 0,
        answer: null,
        model: useGroq ? (process.env.GROQ_MODEL || "openai/gpt-oss-20b") : "deterministic-fixture",
        usage: null,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  const passed = results.filter((result) => result.passed).length;
  const report = {
    timestamp: new Date().toISOString(),
    mode: useGroq ? "groq" : "deterministic",
    model: useGroq ? (process.env.GROQ_MODEL || "openai/gpt-oss-20b") : "deterministic-fixture",
    total: results.length,
    passed,
    failed: results.length - passed,
    passRate: Number((passed / results.length).toFixed(2)),
    results
  };

  await mkdir(dirname(resultsPath), { recursive: true });
  await writeFile(resultsPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.table(results.map(({ id, passed: didPass, groundednessScore, error }) => ({
    id,
    passed: didPass,
    groundednessScore,
    error: error ?? ""
  })));
  console.log(`Evaluation pass rate: ${passed}/${results.length}`);
  console.log(`Report saved to: ${resultsPath}`);

  if (report.failed > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error("Evaluation runner failed:", error);
  process.exitCode = 1;
});
