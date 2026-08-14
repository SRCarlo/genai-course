export class SourceTracker {
  constructor() {
    this.sources = [];
  }

  add(results = []) {
    for (const item of results) {
      const source = {
        sourceId: item.sourceId,
        title: item.title,
        source: item.source,
        chunkId: item.chunkId,
        score: Number(item.score.toFixed(4)),
      };

      const exists = this.sources.some(
        (existing) => existing.chunkId === source.chunkId,
      );

      if (!exists) {
        this.sources.push(source);
      }
    }
  }

  getAll() {
    return this.sources;
  }

  clear() {
    this.sources = [];
  }
}
