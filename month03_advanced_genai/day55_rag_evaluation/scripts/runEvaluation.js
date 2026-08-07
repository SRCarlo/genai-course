import fs from "fs";
import {
  calculateHitAtK,
  calculateRecallAtK,
  calculateReciprocalRank,
} from "../server/services/retrievalEvaluator.js";

// Mock RAG function
async function askRAG(question) {
  const database = {
    "What is Express middleware?": {
      answer:
        "Express middleware functions have access to the request, response, and next function.",
      retrievedSources: [
        "express.md",
        "nodejs.md",
        "mongodb.md",
      ],
    },

    "What is Node.js?": {
      answer:
        "Node.js is a JavaScript runtime built on Chrome's V8 engine.",
      retrievedSources: [
        "nodejs.md",
        "javascript.md",
        "express.md",
      ],
    },

    "What is MongoDB?": {
      answer:
        "MongoDB is a NoSQL document database.",
      retrievedSources: [
        "mongodb.md",
        "database.md",
        "nodejs.md",
      ],
    },
  };

  return (
    database[question] || {
      answer: "No answer available.",
      retrievedSources: [],
    }
  );
}

const questions = JSON.parse(
  fs.readFileSync("./evaluation/questions.json", "utf8")
);

const results = [];

for (const item of questions) {
  console.log(`Evaluating: ${item.question}`);

  const ragResult = await askRAG(item.question);

  const hitAt5 = calculateHitAtK(
    ragResult.retrievedSources,
    item.expectedSources,
    5
  );

  const recallAt5 = calculateRecallAtK(
    ragResult.retrievedSources,
    item.expectedSources,
    5
  );

  const reciprocalRank = calculateReciprocalRank(
    ragResult.retrievedSources,
    item.expectedSources
  );

  results.push({
    question: item.question,
    expectedSources: item.expectedSources,
    retrievedSources: ragResult.retrievedSources,
    generatedAnswer: ragResult.answer,
    hitAt5,
    recallAt5,
    reciprocalRank,
  });
}

fs.writeFileSync(
  "./evaluation/retrieval_results.json",
  JSON.stringify(results, null, 2)
);

console.log("Evaluation completed.");