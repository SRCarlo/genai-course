import path from "path";

import { loadDocuments } from "./document.loader.js";

import { cleanDocument } from "./document.cleaner.js";

import { chunkText } from "./chunker.js";

import {
  createVocabulary,
  embedText,
} from "../embeddings/embedding.service.js";

import { clearStore, addDocuments } from "../store/document.store.js";

export async function ingestDocuments(directory) {
  clearStore();

  const rawDocuments = await loadDocuments(directory);

  const preparedDocuments = [];

  for (const document of rawDocuments) {
    const cleaned = cleanDocument(document.content);

    const chunks = chunkText(cleaned, 120, 30);

    chunks.forEach((content, index) => {
      preparedDocuments.push({
        id: `${document.fileName}-chunk-${index + 1}`,
        documentId: document.fileName,
        content,
        source: document.fileName,
        type: "documentation",
        language: "javascript",
        visibility: "public",
        chunkIndex: index,
        createdAt: new Date().toISOString(),
      });
    });
  }

  const vocabulary = createVocabulary(preparedDocuments);

  const finalDocuments = preparedDocuments.map((document) => ({
    ...document,
    embedding: embedText(document.content, vocabulary),
  }));

  addDocuments(finalDocuments);

  return {
    documents: finalDocuments,
    vocabulary,
  };
}
