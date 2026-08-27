import "dotenv/config";

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { retrieve } from "../rag/retriever.js";

import { hybridSearch } from "../rag/hybrid-search.js";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "../..");

function precisionAtK(retrieved, relevant, k) {
  const top = retrieved.slice(0, k);

  if (!top.length) {
    return 0;
  }

  const hits = top.filter((id) => relevant.includes(id)).length;

  return hits / top.length;
}

function recallAtK(retrieved, relevant, k) {
  if (!relevant.length) {
    return 0;
  }

  const top = retrieved.slice(0, k);

  const hits = relevant.filter((id) => top.includes(id)).length;

  return hits / relevant.length;
}

function reciprocalRank(retrieved, relevant) {
  for (let index = 0; index < retrieved.length; index++) {
    if (relevant.includes(retrieved[index])) {
      return 1 / (index + 1);
    }
  }

  return 0;
}

async function evaluate() {
  const datasetPath = path.join(ROOT, "datasets", "retrieval.json");

  const dataset = JSON.parse(await fs.readFile(datasetPath, "utf8"));

  const strategies = [
    {
      name: "vector",
      search: async (query, topK) => {
        return retrieve(query, {
          topK,
        });
      },
    },
    {
      name: "hybrid",
      search: async (query, topK) => {
        const result = await hybridSearch(query, {
          topK,
        });

        return result.fusedResults;
      },
    },
  ];

  const ks = [3, 5, 10];

  const results = [];

  for (const strategy of strategies) {
    for (const k of ks) {
      let precision = 0;
      let recall = 0;
      let mrr = 0;

      for (const item of dataset) {
        const retrieved = await strategy.search(item.query, k);

        const ids = retrieved.map((doc) => doc.id);

        precision += precisionAtK(ids, item.relevantDocuments, k);

        recall += recallAtK(ids, item.relevantDocuments, k);

        mrr += reciprocalRank(ids, item.relevantDocuments);
      }

      results.push({
        strategy: strategy.name,

        k,

        precision: precision / dataset.length,

        recall: recall / dataset.length,

        mrr: mrr / dataset.length,
      });
    }
  }

  console.table(results);

  const resultsPath = path.join(ROOT, "results", "retrieval-results.json");

  await fs.writeFile(resultsPath, JSON.stringify(results, null, 2));

  console.log(`Results saved to ${resultsPath}`);
}

evaluate().catch((error) => {
  console.error(error);
  process.exit(1);
});
