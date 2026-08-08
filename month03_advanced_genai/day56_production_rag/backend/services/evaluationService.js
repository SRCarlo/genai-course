export function calculateHitAtK(retrievedSources, expectedSources, k = 5) {
  const retrieved = retrievedSources.slice(0, k).map((source) => source.source);

  return expectedSources.some((expected) => retrieved.includes(expected))
    ? 1
    : 0;
}

export function calculateRecallAtK(retrievedSources, expectedSources, k = 5) {
  const retrieved = retrievedSources.slice(0, k).map((source) => source.source);

  const hits = expectedSources.filter((expected) =>
    retrieved.includes(expected),
  ).length;

  return expectedSources.length === 0 ? 0 : hits / expectedSources.length;
}

export function calculateMRR(retrievedSources, expectedSources) {
  for (let index = 0; index < retrievedSources.length; index++) {
    if (expectedSources.includes(retrievedSources[index].source)) {
      return 1 / (index + 1);
    }
  }

  return 0;
}
