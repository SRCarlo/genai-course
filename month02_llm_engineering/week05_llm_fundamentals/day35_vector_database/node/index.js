import { addDocument, getDocuments } from "./vectorStore.js";
import cosineSimilarity from "./search.js";

// Sample documents
const documents = [
  {
    id: 1,
    text: "Node.js is used for backend development.",
  },
  {
    id: 2,
    text: "Python is widely used in Artificial Intelligence.",
  },
  {
    id: 3,
    text: "React is a frontend JavaScript library.",
  },
  {
    id: 4,
    text: "Express.js is a backend framework.",
  },
];

// Sample embeddings (for learning only)
const embeddings = [
  [0.1, 0.3, 0.8],
  [0.9, 0.2, 0.1],
  [0.2, 0.8, 0.4],
  [0.15, 0.35, 0.75],
];

// Store documents
for (let i = 0; i < documents.length; i++) {
  addDocument(documents[i], embeddings[i]);
}

console.log("Documents stored in Vector Store:");
console.log(getDocuments());

// Query embedding (example)
const queryEmbedding = [0.12, 0.32, 0.78];

const results = getDocuments().map((item) => ({
  text: item.document.text,
  score: cosineSimilarity(queryEmbedding, item.embedding),
}));

results.sort((a, b) => b.score - a.score);

console.log("\nTop Match:");
console.log(results[0]);
