import { retrieveDocuments } from "../rag/retriever.js";
import { rerankDocuments } from "../rag/reranker.js";

export async function searchKnowledgeBase(query) {
  const documents = await retrieveDocuments(query, 5);

  const reranked = rerankDocuments(query, documents);

  return {
    success: true,

    query,

    results: reranked.slice(0, 3).map((document) => ({
      id: document.id,
      title: document.title,
      content: document.content,
      score: document.relevance,
    })),
  };
}
