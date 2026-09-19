import { randomUUID } from "node:crypto";

export class DocumentService {
  constructor({ documentRepository, vectorRepository, ingestionQueue }) {
    this.documentRepository = documentRepository;
    this.vectorRepository = vectorRepository;
    this.ingestionQueue = ingestionQueue;
  }

  async create({ tenantId, name, mimeType, content }) {
    const document = await this.documentRepository.create({
      id: randomUUID(),
      tenantId,
      name,
      mimeType,
      content,
      status: "UPLOADED"
    });

    await this.ingestionQueue.add({
      documentId: document.id,
      tenantId
    });

    return document;
  }

  async getById(id, tenantId) {
    return this.documentRepository.findById(id, tenantId);
  }

  async list(tenantId) {
    return this.documentRepository.listByTenant(tenantId);
  }

  async delete(id, tenantId) {
    const document = await this.documentRepository.findById(id, tenantId);
    if (!document) return null;

    await this.vectorRepository.deleteByDocumentId(id, tenantId);
    return this.documentRepository.delete(id, tenantId);
  }
}
