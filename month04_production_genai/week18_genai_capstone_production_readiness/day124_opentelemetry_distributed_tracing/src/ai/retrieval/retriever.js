export class MockRetriever {
  constructor(documents = []) {
    this.documents = documents;
  }

  async search({ tenantId, query, limit = 5 }) {
    if (typeof tenantId !== 'string' || !tenantId || typeof query !== 'string' || !query.trim()) {
      throw new Error('INVALID_RETRIEVAL_REQUEST');
    }

    const terms = query.toLowerCase().split(/\W+/).filter((term) => term.length > 2);
    if (terms.length === 0) return [];

    return this.documents
      .filter((document) => document.tenantId === tenantId)
      .map((document) => {
        const content = String(document.content ?? '');
        const searchable = `${content} ${document.source ?? ''}`.toLowerCase();
        const score = terms.reduce((total, term) => total + (searchable.includes(term) ? 1 : 0), 0);
        return { document, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ document, score }) => ({
        id: document.id,
        content: document.content,
        source: document.source,
        score,
      }));
  }
}
