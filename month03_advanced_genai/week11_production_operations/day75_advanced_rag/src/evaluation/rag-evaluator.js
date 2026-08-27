import "dotenv/config";

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { advancedRAG } from "../rag/pipeline.js";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "../..");

function containsExpectedKeywords(answer, keywords) {
  const normalized = answer.toLowerCase();

  return keywords.every((keyword) =>
    normalized.includes(keyword.toLowerCase()),
  );
}

async function evaluateRAG() {
  const datasetPath = path.join(ROOT, "datasets", "rag.json");

  const dataset = JSON.parse(await fs.readFile(datasetPath, "utf8"));

  const results = [];

  for (const item of dataset) {
    const result = await advancedRAG(item.query, {
      topK: 10,
      finalK: 5,
      metadataFilter: {
        tenantId: "tenant_1",
      },
    });

    const passed = containsExpectedKeywords(
      result.answer,
      item.expectedKeywords,
    );

    results.push({
      id: item.id,
      query: item.query,
      passed,
      answer: result.answer,
      trace: result.trace,
    });
  }

  const passedCount = results.filter((item) => item.passed).length;

  const score = passedCount / results.length;

  const output = {
    score,
    passed: passedCount,
    total: results.length,
    results,
  };

  console.log(JSON.stringify(output, null, 2));

  await fs.writeFile(
    path.join(ROOT, "results", "rag-results.json"),
    JSON.stringify(output, null, 2),
  );
}

evaluateRAG().catch((error) => {
  console.error(error);
  process.exit(1);
});
