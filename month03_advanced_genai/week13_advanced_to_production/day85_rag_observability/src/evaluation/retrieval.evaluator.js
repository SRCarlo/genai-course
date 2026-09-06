import {
  recallAtK,
  precisionAtK,
  reciprocalRank
} from "./metrics.js";

export function evaluateRetrieval({
  results,
  relevantDocuments
}) {
  return {
    recallAt3: recallAtK(
      results,
      relevantDocuments,
      3
    ),

    recallAt5: recallAtK(
      results,
      relevantDocuments,
      5
    ),

    recallAt10: recallAtK(
      results,
      relevantDocuments,
      10
    ),

    precisionAt3: precisionAtK(
      results,
      relevantDocuments,
      3
    ),

    precisionAt5: precisionAtK(
      results,
      relevantDocuments,
      5
    ),

    mrr: reciprocalRank(
      results,
      relevantDocuments
    )
  };
}