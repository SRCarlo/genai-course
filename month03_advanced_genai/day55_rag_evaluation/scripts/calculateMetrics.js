import fs from "fs";

const results = JSON.parse(
  fs.readFileSync("./evaluation/retrieval_results.json", "utf8"),
);

const hitRate = results.filter((r) => r.hitAt5).length / results.length;

const averageRecall =
  results.reduce((sum, r) => sum + r.recallAt5, 0) / results.length;

const mrr =
  results.reduce((sum, r) => sum + r.reciprocalRank, 0) / results.length;

console.log("\n===== RAG Evaluation Metrics =====");
console.log(`Questions      : ${results.length}`);
console.log(`Hit@5          : ${(hitRate * 100).toFixed(2)}%`);
console.log(`Recall@5       : ${(averageRecall * 100).toFixed(2)}%`);
console.log(`MRR            : ${mrr.toFixed(2)}`);
