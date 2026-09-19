export class Retriever {
  constructor(vectorRepository, options = {}) {
    this.vectorRepository = vectorRepository;
    this.topK = options.topK ?? 5;
    this.maxDistance = options.maxDistance ?? 0.75;
  }

  async retrieve({ queryVector, tenantId, topK = this.topK }) {
    return this.vectorRepository.search({
      queryVector,
      tenantId,
      topK,
      maxDistance: this.maxDistance
    });
  }
}
