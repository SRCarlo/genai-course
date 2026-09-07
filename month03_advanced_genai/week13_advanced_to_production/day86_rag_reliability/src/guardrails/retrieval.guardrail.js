export function validateRetrieval(
  results,
  threshold = Number(
    process.env.RETRIEVAL_THRESHOLD || 0.65
  )
) {
  if (!Array.isArray(results)) {
    return {
      hasRelevantContext: false,
      results: []
    };
  }

  const relevant =
    results.filter(
      (result) =>
        typeof result.score === "number" &&
        result.score >= threshold
    );

  return {
    hasRelevantContext:
      relevant.length > 0,

    results: relevant
  };
}