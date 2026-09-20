import dataset from "./dataset.json" with { type: "json" };
import { createEmbedding } from "../src/ai/embeddings/embedding.service.js";
import { VectorSearch } from "../src/ai/retrieval/vector.search.js";
import { KeywordSearch } from "../src/ai/retrieval/keyword.search.js";
import { HybridSearch } from "../src/ai/retrieval/hybrid.search.js";
import { documentRepository } from "../src/infrastructure/repositories/inMemory.document.repository.js";
import {
  recallAtK,
  precisionAtK,
  reciprocalRank,
  mean,
} from "./retrieval.metrics.js";
const vectorSearch = new VectorSearch({ repository: documentRepository });
const keywordSearch = new KeywordSearch({ repository: documentRepository });
const hybridSearch = new HybridSearch({ vectorSearch, keywordSearch });
const systems = { vector: [], keyword: [], hybrid: [] };
for (const item of dataset) {
  const e = createEmbedding(item.question);
  const v = await vectorSearch.search(e, { topK: 5 });
  const k = await keywordSearch.search(item.question, { topK: 5 });
  const h = await hybridSearch.search({
    query: item.question,
    queryEmbedding: e,
    topK: 5,
  });
  for (const [name, results] of Object.entries({
    vector: v,
    keyword: k,
    hybrid: h,
  })) {
    systems[name].push({
      recall: recallAtK(results, item.relevantDocuments, 5),
      precision: precisionAtK(results, item.relevantDocuments, 5),
      mrr: reciprocalRank(results, item.relevantDocuments),
    });
  }
}
const summary = (s) => ({
  recallAt5: Number(mean(s.map((x) => x.recall)).toFixed(3)),
  precisionAt5: Number(mean(s.map((x) => x.precision)).toFixed(3)),
  mrr: Number(mean(s.map((x) => x.mrr)).toFixed(3)),
});
console.table(
  Object.fromEntries(Object.entries(systems).map(([k, v]) => [k, summary(v)])),
);
