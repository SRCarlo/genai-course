import { documents } from "../retrieval/documents.js";
import { hybridSearch } from "../retrieval/hybrid-search.js";
import { generateAnswer } from "../llm/groq.client.js";
import { createTrace } from "../../infrastructure/observability/tracer.js";
import { calculateCost } from "../../infrastructure/observability/cost.js";
import { FailureType } from "../../infrastructure/observability/failure.types.js";

function buildContext(results) {
  return results
    .map((doc, index) => `[${index + 1}] ${doc.id} — ${doc.title}\n${doc.text}`)
    .join("\n\n");
}

export async function answerQuestion({ question, requestId, topK = 5 }) {
  const trace = createTrace(requestId);

  if (!question || !question.trim()) {
    return {
      requestId,
      answer: "",
      retrievedDocuments: [],
      error: {
        type: FailureType.INVALID_INPUT,
        message: "Question is required.",
      },
    };
  }

  let retrieval;
  let generation;

  try {
    const retrievalSpan = trace.startSpan("hybrid_retrieval");
    const retrievalStart = Date.now();

    retrieval = hybridSearch(question, documents, topK);

    retrievalSpan.end({
      retrievalLatencyMs: Date.now() - retrievalStart,
      resultCount: retrieval.results.length,
    });
  } catch (error) {
    return {
      requestId,
      answer: "",
      retrievedDocuments: [],
      error: {
        type: FailureType.RETRIEVAL_ERROR,
        message: error.message,
      },
    };
  }

  if (!retrieval.results.length || retrieval.results[0].rrfScore <= 0) {
    const traceResult = trace.finish();
    return {
      requestId,
      answer:
        "The knowledge base does not contain enough information to answer this question.",
      retrievedDocuments: [],
      trace: traceResult,
      error: {
        type: FailureType.NO_RELEVANT_CONTEXT,
        message: "No relevant context found.",
      },
    };
  }

  const context = buildContext(retrieval.results);

  try {
    const llmSpan = trace.startSpan("llm");
    generation = await generateAnswer({ question, context });
    llmSpan.end({
      inputTokens: generation.usage.inputTokens,
      outputTokens: generation.usage.outputTokens,
    });
  } catch (error) {
    return {
      requestId,
      answer: "",
      retrievedDocuments: retrieval.results,
      trace: trace.finish(),
      error: {
        type: FailureType.LLM_ERROR,
        message: error.message,
      },
    };
  }

  const totalTokens = generation.usage.totalTokens;
  const cost = calculateCost({
    inputTokens: generation.usage.inputTokens,
    outputTokens: generation.usage.outputTokens,
  });

  return {
    requestId,
    question,
    answer: generation.answer,
    context,
    retrievedDocuments: retrieval.results.map((doc) => ({
      id: doc.id,
      title: doc.title,
      score: doc.rrfScore,
      sources: doc.sources,
    })),
    usage: generation.usage,
    costUsd: cost,
    model: generation.model,
    trace: trace.finish(),
    error: null,
  };
}
