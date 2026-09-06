export function recallAtK(
  results,
  relevantDocuments,
  k
) {
  if (
    !relevantDocuments ||
    relevantDocuments.length === 0
  ) {
    return 0;
  }

  const topResults =
    results.slice(0, k);

  const retrievedIds = new Set(
    topResults.map(
      (result) =>
        result.documentId ??
        result.id
    )
  );

  const found =
    relevantDocuments.filter(
      (id) =>
        retrievedIds.has(id)
    );

  return (
    found.length /
    relevantDocuments.length
  );
}

export function precisionAtK(
  results,
  relevantDocuments,
  k
) {
  const topResults =
    results.slice(0, k);

  if (topResults.length === 0) {
    return 0;
  }

  const relevant =
    topResults.filter((result) => {
      const id =
        result.documentId ??
        result.id;

      return relevantDocuments.includes(id);
    });

  return (
    relevant.length /
    topResults.length
  );
}

export function reciprocalRank(
  results,
  relevantDocuments
) {
  const index =
    results.findIndex((result) => {
      const id =
        result.documentId ??
        result.id;

      return relevantDocuments.includes(id);
    });

  if (index === -1) {
    return 0;
  }

  return 1 / (index + 1);
}

export function mean(values) {
  if (!values.length) {
    return 0;
  }

  return (
    values.reduce(
      (sum, value) =>
        sum + value,
      0
    ) / values.length
  );
}

export function percentile(
  values,
  percentileValue
) {
  if (!values.length) {
    return 0;
  }

  const sorted = [...values].sort(
    (a, b) => a - b
  );

  const index = Math.ceil(
    (percentileValue / 100) *
      sorted.length
  ) - 1;

  return sorted[
    Math.max(0, index)
  ];
}