import { tokenize } from "../utils/score.js";

export function buildVocabulary(documents) {
  const vocabulary = new Set();

  for (const document of documents) {
    for (const token of tokenize(document.content)) {
      vocabulary.add(token);
    }
  }

  return [...vocabulary];
}

export function createVector(text, vocabulary) {
  const tokens = tokenize(text);

  const frequencies = new Map();

  for (const token of tokens) {
    frequencies.set(token, (frequencies.get(token) || 0) + 1);
  }

  return vocabulary.map((word) => frequencies.get(word) || 0);
}

export function createDocumentVectors(documents) {
  const vocabulary = buildVocabulary(documents);

  const vectors = documents.map((document) => ({
    ...document,
    vector: createVector(document.content, vocabulary),
  }));

  return {
    vocabulary,
    documents: vectors,
  };
}
