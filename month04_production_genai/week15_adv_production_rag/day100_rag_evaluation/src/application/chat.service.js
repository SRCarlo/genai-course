import { answerQuestion } from "../ai/rag/rag.service.js";
import { createRequestId } from "../infrastructure/observability/request-id.js";

export async function chat(question) {
  const requestId = createRequestId();
  return answerQuestion({
    question,
    requestId,
    topK: Number(process.env.TOP_K || 5),
  });
}
