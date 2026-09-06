export const FAILURE_TYPES = {
  RETRIEVAL_FAILURE:
    "retrieval_failure",

  RERANKING_FAILURE:
    "reranking_failure",

  CONTEXT_FAILURE:
    "context_failure",

  GENERATION_FAILURE:
    "generation_failure",

  TIMEOUT:
    "timeout",

  PROVIDER_ERROR:
    "provider_error"
};

export function classifyFailure({
  trace,
  expectedDocuments = []
}) {
  if (
    trace.retrieval
      .rerankedResults
      .length === 0
  ) {
    return FAILURE_TYPES.RETRIEVAL_FAILURE;
  }

  const retrievedIds =
    trace.retrieval.rerankedResults.map(
      (item) => item.id
    );

  const hasExpected =
    expectedDocuments.some(
      (id) =>
        retrievedIds.includes(id)
    );

  if (!hasExpected) {
    return FAILURE_TYPES.RETRIEVAL_FAILURE;
  }

  if (
    trace.context.chunks.length === 0
  ) {
    return FAILURE_TYPES.CONTEXT_FAILURE;
  }

  if (
    trace.errors.some(
      (error) =>
        error.type ===
        "generation_failure"
    )
  ) {
    return FAILURE_TYPES.GENERATION_FAILURE;
  }

  return null;
}