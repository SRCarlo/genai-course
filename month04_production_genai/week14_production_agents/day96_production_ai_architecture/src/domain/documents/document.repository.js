const documents = new Map();

export const documentRepository = {
  async create(document) {
    documents.set(document.id, document);

    return document;
  },

  async findById(id) {
    return documents.get(id) || null;
  },

  async findByTenant(tenantId) {
    return Array.from(documents.values()).filter(
      (document) => document.tenantId === tenantId,
    );
  },
};
