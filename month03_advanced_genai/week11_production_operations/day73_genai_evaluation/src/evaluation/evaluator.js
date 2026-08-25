import { exactMatchScore } from "./correctness.js";
import { relevanceScore } from "./relevance.js";
import { semanticSimilarity } from "./similarity.js";
import { faithfulnessScore } from "./faithfulness.js";

import { weightedScore } from "../utils/score.js";

import { judgeAnswer } from "../services/llm.service.js";

export async function evaluateAnswer({
  question,
  expectedAnswer,
  actualAnswer,
  context = null,
}) {
  const exact = exactMatchScore(actualAnswer, expectedAnswer);

  const lexicalRelevance = relevanceScore(question, actualAnswer);

  const semantic = semanticSimilarity(actualAnswer, expectedAnswer);

  const basicFaithfulness = faithfulnessScore(actualAnswer, context);

  const judge = await judgeAnswer({
    question,
    expectedAnswer,
    actualAnswer,
    context,
  });

  const correctness = Number(judge.correctness ?? exact);

  const relevance = Number(judge.relevance ?? lexicalRelevance);

  const faithfulness = Number(judge.faithfulness ?? basicFaithfulness);

  const overall = weightedScore({
    correctness,
    relevance,
    faithfulness,
  });

  return {
    exactMatch: exact,

    semanticSimilarity: semantic,

    lexicalRelevance,

    basicFaithfulness,

    correctness,

    relevance,

    faithfulness,

    overall,

    judgeReason: judge.reason || "",
  };
}

export function evaluateRetrieval({
  retrievedDocuments,
  relevantDocuments,
  k = retrievedDocuments.length,
}) {
  const retrieved = retrievedDocuments.slice(0, k);

  const relevant = new Set(relevantDocuments);

  const relevantRetrieved = retrieved.filter((doc) => relevant.has(doc));

  const precision =
    retrieved.length === 0 ? 0 : relevantRetrieved.length / retrieved.length;

  const recall =
    relevant.size === 0 ? 0 : relevantRetrieved.length / relevant.size;

  const hitRate = relevantRetrieved.length > 0 ? 1 : 0;

  let reciprocalRank = 0;

  for (let index = 0; index < retrieved.length; index++) {
    if (relevant.has(retrieved[index])) {
      reciprocalRank = 1 / (index + 1);

      break;
    }
  }

  return {
    precision: Number(precision.toFixed(4)),

    recall: Number(recall.toFixed(4)),

    hitRate,

    reciprocalRank: Number(reciprocalRank.toFixed(4)),
  };
}
