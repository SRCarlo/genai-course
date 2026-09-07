import { ZodError } from "zod";

import { validateQuery } from "../guardrails/input.guardrail.js";

import { validateRetrieval } from "../guardrails/retrieval.guardrail.js";

import { limitContext } from "../guardrails/context.guardrail.js";

import { validateOutput } from "../guardrails/output.guardrail.js";

import { validateSources } from "../guardrails/source.guardrail.js";

import { detectPromptInjection } from "../security/prompt.injection.js";

import { retrieve } from "../retrieval/retriever.js";

import { rerank } from "../reranking/reranker.js";

import { buildContext } from "../context/context.builder.js";

import { generateRagAnswer } from "../llm/groq.client.js";

import { retry } from "../reliability/retry.js";

import { withTimeout } from "../reliability/timeout.js";

import { CircuitBreaker } from "../reliability/circuit.breaker.js";

import { buildSafeFallback } from "../reliability/fallback.js";

import { AppError, ERROR_TYPES } from "../reliability/errors.js";

import { logger } from "../observability/logger.js";

const circuitBreaker = new CircuitBreaker();

export async function processRagQuery(input) {
  let validatedInput;

  try {
    validatedInput = validateQuery(input);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError(
        ERROR_TYPES.INVALID_INPUT,
        "Invalid request input.",
        400,
      );
    }

    throw error;
  }

  const { question } = validatedInput;

  if (detectPromptInjection(question)) {
    logger.warn("prompt_injection_detected");

    throw new AppError(
      ERROR_TYPES.INVALID_INPUT,
      "The request contains potentially unsafe instructions.",
      400,
    );
  }

  let retrievedDocuments;

  try {
    retrievedDocuments = await retrieve(question);
  } catch (error) {
    logger.error("retrieval_failed", {
      error: error.message,
    });

    throw new AppError(
      ERROR_TYPES.RETRIEVAL_ERROR,
      "Unable to retrieve reference information.",
      503,
    );
  }

  const retrieval = validateRetrieval(retrievedDocuments);

  if (!retrieval.hasRelevantContext) {
    return {
      answer: "I don't have enough information to answer that.",

      sources: [],
    };
  }

  let ranked = rerank(retrieval.results);

  ranked = limitContext(ranked);

  const context = buildContext(ranked);

  let rawResponse;

  try {
    rawResponse = await circuitBreaker.execute(() =>
      retry(() =>
        withTimeout((signal) =>
          generateRagAnswer({
            question,
            context,
            signal,
          }),
        ),
      ),
    );
  } catch (error) {
    logger.error("groq_request_failed", {
      error: error.message,

      circuit: circuitBreaker.getState(),
    });

    return buildSafeFallback(ranked);
  }

  let parsedResponse;

  try {
    parsedResponse = JSON.parse(rawResponse);

    parsedResponse = validateOutput(parsedResponse);
  } catch (error) {
    logger.error("output_validation_failed", {
      error: error.message,
    });

    throw new AppError(
      ERROR_TYPES.OUTPUT_VALIDATION_ERROR,
      "The AI service returned an invalid response.",
      502,
    );
  }

  return validateSources(parsedResponse, ranked);
}
