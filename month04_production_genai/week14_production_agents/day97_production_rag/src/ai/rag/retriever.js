export class Retriever {
  constructor(vectorRepository) {
    this.vectorRepository = vectorRepository;
  }

  async retrieve(queryVector, options = {}) {
    return this.vectorRepository.search(queryVector, {
      topK: options.topK || 5,

      filter: options.filter,

      threshold: options.threshold || 0,
    });
  }
}
