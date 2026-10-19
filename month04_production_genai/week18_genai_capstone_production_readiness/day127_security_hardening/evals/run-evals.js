
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { evaluateAnswer } from "./evaluator.js";

const currentDir = dirname(fileURLToPath(import.meta.url));
const datasetPath = resolve(currentDir, "datasets", "chat-cases.json");
const resultsPath = resolve(currentDir, "results", "latest.json");
const useGroq = process.env.EVAL_USE_GROQ === "true";
const minimumPassRate = 0.90;

const sampleAnswers = {
  "refund-policy-001":
    "Customers can request a refund within 30 days of purchase.",
  "shipping-policy-001":
    "Standard shipping takes 3 to 5 business days.",
  "unsupported-policy-001":
    "The provided information is not specified for lifetime free repairs.",
  "returns-condition-001":
    "The provided information is not specified for return shipping costs.",
  "shipping-window-001":
    "Standard shipping takes 3 to 5 business days."
};

async function loadCases() {
  const raw = await readFile(datasetPath, "utf8");
  const cases = JSON.parse(raw);

  if (!Array.isArray(cases) || cases.length === 0) {
    throw new Error("Evaluation dataset must be a non-empty JSON array.");
  }

  const ids = new Set();
  for (const item of cases) {
    if (!item || typeof item.id !== "string" || !item.id.trim()) {
      throw new Error("Every evaluation case must have a non-empty id.");
    }
    if (ids.has(item.id)) {
      throw new Error(`Duplicate evaluation id: ${item.id}`);
    }
    ids.add(item.id);
  }

  return cases;
}

async function main() {
  const cases = await loadCases();
  let client = null;

  if (useGroq) {
    const { createGroqClient } = await import("./chat-adapter.js");
    client = createGroqClient();
  }

  const results = [];

  for (const testCase of cases) {
    try {
      let modelResult;

      if (useGroq) {
        const { runChatEvaluation } = await import("./chat-adapter.js");
        modelResult = await runChatEvaluation({ testCase, client });
      } else {
        const answer = sampleAnswers[testCase.id];
        if (typeof answer !== "string") {
          throw new Error(`Missing sample answer for ${testCase.id}.`);
        }
        modelResult = {
          answer,
          model: "deterministic-fixture",
          usage: null
        };
      }

      results.push({
        ...evaluateAnswer(testCase, modelResult.answer),
        answer: modelResult.answer,
        model: modelResult.model,
        usage: modelResult.usage,
        error: null
      });
    } catch (error) {
      results.push({
        id: testCase.id,
        passed: false,
        groundednessScore: 0,
        answer: null,
        model: useGroq
          ? process.env.GROQ_MODEL || "openai/gpt-oss-20b"
          : "deterministic-fixture",
        usage: null,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  const passed = results.filter((result) => result.passed === true).length;
  const failed = results.length - passed;
  const passRate = results.length === 0 ? 0 : passed / results.length;

  const report = {
    timestamp: new Date().toISOString(),
    mode: useGroq ? "groq" : "deterministic",
    model: useGroq
      ? process.env.GROQ_MODEL || "openai/gpt-oss-20b"
      : "deterministic-fixture",
    total: results.length,
    passed,
    failed,
    passRate: Number(passRate.toFixed(2)),
    minimumPassRate,
    qualityGatePassed: results.length > 0 && passRate >= minimumPassRate,
    results
  };

  await mkdir(dirname(resultsPath), { recursive: true });
  await writeFile(resultsPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.table(
    results.map(({ id, passed: didPass, groundednessScore, error }) => ({
      id,
      passed: didPass,
      groundednessScore: groundednessScore ?? 0,
      error: error ?? ""
    }))
  );

  console.log(`Evaluation pass rate: ${(passRate * 100).toFixed(0)}%`);
  console.log(`Minimum required pass rate: ${(minimumPassRate * 100).toFixed(0)}%`);
  console.log(`Report saved to: ${resultsPath}`);

  if (!report.qualityGatePassed) {
    console.error("Quality gate failed.");
    process.exitCode = 1;
  } else {
    console.log("Quality gate passed.");
  }
}

main().catch((error) => {
  console.error("Evaluation runner failed:", error.message);
  process.exitCode = 1;
});
