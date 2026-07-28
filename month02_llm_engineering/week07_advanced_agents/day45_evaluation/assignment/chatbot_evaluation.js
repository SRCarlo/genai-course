import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

import { evaluate } from "../evaluators/accuracyEvaluator.js";
import { calculateScore } from "../metrics/metrics.js";

const dataset = JSON.parse(
  fs.readFileSync("./datasets/evaluationData.json", "utf-8"),
);

const chatbotAnswers = {
  "Capital of India": "New Delhi",

  "Capital of France": "Paris",

  "Largest Ocean": "Atlantic Ocean",

  "2 + 2": "4",

  "Creator of Node.js": "Ryan Dahl",
};

let passed = 0;
let failed = 0;

const report = [];

dataset.forEach((item) => {
  const actual = chatbotAnswers[item.question];

  const result = evaluate(item.expected, actual);

  if (result) {
    passed++;
  } else {
    failed++;
  }

  report.push({
    question: item.question,

    expected: item.expected,

    actual,

    passed: result,
  });
});

const accuracy = calculateScore(passed, dataset.length);

const finalReport = {
  accuracy,

  passed,

  failed,

  hallucinations: failed,

  results: report,
};

fs.writeFileSync(
  "./reports/evaluationReport.json",

  JSON.stringify(finalReport, null, 2),
);

console.log(finalReport);
