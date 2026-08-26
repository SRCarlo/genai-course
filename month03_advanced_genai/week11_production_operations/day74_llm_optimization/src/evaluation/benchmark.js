import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import {
  runPromptExperiment,
  evaluateExperimentResult,
  summarizeExperiment,
} from "../services/optimization.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasetPath = path.join(__dirname, "../../datasets/benchmark.json");

export async function loadBenchmark() {
  const content = await fs.readFile(datasetPath, "utf8");

  return JSON.parse(content);
}

export async function runBenchmark({
  promptVersion,
  model,
  temperature = 0.3,
}) {
  const dataset = await loadBenchmark();

  const results = [];

  for (const item of dataset) {
    const result = await runPromptExperiment({
      promptVersion,
      datasetItem: item,
      model,
      temperature,
    });

    const evaluated = evaluateExperimentResult(result);

    results.push(evaluated);
  }

  const summary = summarizeExperiment(results);

  return {
    promptVersion,
    model,
    temperature,
    dataset: "benchmark-v1",
    results,
    summary,
  };
}
