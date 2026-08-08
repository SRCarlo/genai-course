import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { tokenize } from "./queryService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VECTOR_STORE_PATH = path.resolve(
  __dirname,
  "../../data/vector-store.json",
);

async function loadDocuments() {
  try {
    const raw = await fs.readFile(VECTOR_STORE_PATH, "utf-8");

    if (!raw.trim()) {
      return [];
    }

    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function calculateBM25(queryTokens, documentTokens, allDocuments) {
  const k1 = 1.5;
  const b = 0.75;

  const documentLength = documentTokens.length;

  const averageLength =
    allDocuments.reduce((sum, doc) => sum + doc.tokens.length, 0) /
    Math.max(allDocuments.length, 1);

  let score = 0;

  for (const term of queryTokens) {
    const termFrequency = documentTokens.filter(
      (token) => token === term,
    ).length;

    if (termFrequency === 0) {
      continue;
    }

    const documentFrequency = allDocuments.filter((doc) =>
      doc.tokens.includes(term),
    ).length;

    const totalDocuments = allDocuments.length;

    const idf = Math.log(
      1 +
        (totalDocuments - documentFrequency + 0.5) / (documentFrequency + 0.5),
    );

    const numerator = termFrequency * (k1 + 1);

    const denominator =
      termFrequency + k1 * (1 - b + b * (documentLength / averageLength));

    score += idf * (numerator / denominator);
  }

  return score;
}

export async function keywordSearch(query, options = {}) {
  const topK = options.topK || Number(process.env.KEYWORD_TOP_K || 8);

  const documents = await loadDocuments();

  const queryTokens = tokenize(query);

  const results = documents
    .map((doc) => ({
      ...doc,
      keywordScore: calculateBM25(queryTokens, doc.tokens, documents),
    }))
    .filter((doc) => doc.keywordScore > 0)
    .sort((a, b) => b.keywordScore - a.keywordScore)
    .slice(0, topK);

  return results;
}
