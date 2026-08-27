import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { vectorSearch } from "../services/vector.service.js";
import { tokenize } from "../utils/score.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "../..");

let documentsCache = null;

async function loadDocuments() {
  if (documentsCache) {
    return documentsCache;
  }

  const metadataPath = path.join(
    ROOT,
    "data",
    "metadata",
    "documents.json"
  );

  const metadata = JSON.parse(
    await fs.readFile(metadataPath, "utf8")
  );

  const documents = [];

  for (const item of metadata) {
    const documentPath = path.join(
      ROOT,
      "data",
      "documents",
      item.filename
    );

    const content = await fs.readFile(
      documentPath,
      "utf8"
    );

    documents.push({
      id: item.id,
      title: item.title,
      content,
      metadata: item.metadata
    });
  }

  documentsCache = documents;

  return documents;
}

function metadataMatches(document, filter = {}) {
  return Object.entries(filter).every(
    ([key, value]) =>
      document.metadata?.[key] === value
  );
}

function keywordScore(query, content) {
  const queryTokens = tokenize(query);
  const contentTokens = tokenize(content);

  if (!queryTokens.length) {
    return 0;
  }

  let score = 0;

  for (const queryToken of queryTokens) {
    const matches = contentTokens.filter(
      (token) => token === queryToken
    ).length;

    score += matches;
  }

  return score;
}

async function keywordSearch(
  query,
  {
    topK = 10,
    metadataFilter = {}
  } = {}
) {
  const documents = await loadDocuments();

  return documents
    .filter((document) =>
      metadataMatches(
        document,
        metadataFilter
      )
    )
    .map((document) => ({
      ...document,
      score: keywordScore(
        query,
        document.content
      ),
      searchType: "keyword"
    }))
    .filter((document) => document.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

function reciprocalRankFusion(
  resultLists,
  k = 60
) {
  const map = new Map();

  for (const results of resultLists) {
    results.forEach((document, index) => {
      const rank = index + 1;

      if (!map.has(document.id)) {
        map.set(document.id, {
          ...document,
          rrfScore: 0,
          appearances: 0
        });
      }

      const existing = map.get(document.id);

      existing.rrfScore += 1 / (k + rank);
      existing.appearances += 1;

      if (
        document.searchType === "keyword"
      ) {
        existing.keywordScore = document.score;
      }

      if (
        document.searchType === "vector"
      ) {
        existing.vectorScore = document.score;
      }
    });
  }

  return [...map.values()]
    .sort((a, b) =>
      b.rrfScore - a.rrfScore
    );
}

export async function hybridSearch(
  query,
  {
    topK = 10,
    metadataFilter = {}
  } = {}
) {
  const [vectorResults, keywordResults] =
    await Promise.all([
      vectorSearch(query, {
        topK,
        metadataFilter
      }),

      keywordSearch(query, {
        topK,
        metadataFilter
      })
    ]);

  const fused = reciprocalRankFusion([
    vectorResults,
    keywordResults
  ]);

  return {
    vectorResults,
    keywordResults,
    fusedResults: fused.slice(0, topK)
  };
}
