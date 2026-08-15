export function addSources(state, results) {
  for (const result of results) {
    const exists = state.sources.some(
      (source) =>
        source.source === result.source && source.chunkId === result.chunkId,
    );

    if (!exists) {
      state.sources.push({
        source: result.source,
        chunkId: result.chunkId,
        score: result.score,
      });
    }
  }
}
