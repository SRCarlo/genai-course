export class VectorRetriever {
  constructor(index) {
    this.index = index;
  }

  search(query, limit = 10) {
    return this.index.search(query, limit);
  }
}