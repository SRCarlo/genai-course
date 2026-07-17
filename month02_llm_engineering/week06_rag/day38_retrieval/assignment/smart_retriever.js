import fs from "fs";

import { retrieve } from "../node/retriever.js";

import hybridSearch from "../node/hybrid.js";

import rerank from "../node/rerank.js";

import topK from "../node/topK.js";

const documents = JSON.parse(fs.readFileSync("./data/documents.json", "utf8"));

const embeddings = {
  express: [0.95, 0.88, 0.81],

  node: [0.91, 0.83, 0.77],

  mongodb: [0.78, 0.81, 0.75],

  react: [0.32, 0.44, 0.29],
};

function createEmbedding(question) {
  const q = question.toLowerCase();

  for (const key in embeddings) {
    if (q.includes(key)) {
      return embeddings[key];
    }
  }

  return [0.5, 0.5, 0.5];
}

export default function smartRetriever(question) {
  const embedding = createEmbedding(question);

  const vectorResults = retrieve(documents, embedding);

  const hybridResults = hybridSearch(vectorResults, question);

  const ranked = rerank(hybridResults, question);

  const results = topK(ranked, 3);

  return results.map((doc) => ({
    id: doc.id,

    text: doc.text,

    metadata: doc.metadata,

    score: Number(doc.score.toFixed(3)),
  }));
}
