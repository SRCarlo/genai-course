export class TenantRAG {
  constructor(documents = []) {
    this.documents = [...documents];
  }

  search(tenantId, query) {
    const normalizedQuery = query.toLowerCase();

    return this.documents.filter(
      (document) =>
        document.tenantId === tenantId &&
        document.text.toLowerCase().includes(normalizedQuery)
    );
  }

  add(document) {
    if (!document.tenantId || !document.text) {
      throw new Error("Document requires tenantId and text");
    }

    this.documents.push({ ...document });
  }
}