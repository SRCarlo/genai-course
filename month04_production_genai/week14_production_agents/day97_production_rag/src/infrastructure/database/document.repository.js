import { randomUUID } from "node:crypto";

export class DocumentRepository {
  constructor() {
    this.documents = [];
  }

  async create(data) {
    const document = {
      id: randomUUID(),

      name: data.name,

      content: data.content,

      tenantId: data.tenantId,

      ownerId: data.ownerId,

      mimeType: data.mimeType || "text/plain",

      size: data.size || Buffer.byteLength(data.content || "", "utf8"),

      status: "uploaded",

      createdAt: new Date().toISOString(),

      updatedAt: new Date().toISOString(),

      error: null,
    };

    this.documents.push(document);

    return document;
  }

  async findById(id) {
    return this.documents.find((document) => document.id === id) || null;
  }

  async updateStatus(id, status, error = null) {
    const document = await this.findById(id);

    if (!document) {
      throw new Error("DOCUMENT_NOT_FOUND");
    }

    document.status = status;

    document.error = error;

    document.updatedAt = new Date().toISOString();

    return document;
  }

  async findAllByTenant(tenantId) {
    return this.documents.filter((document) => document.tenantId === tenantId);
  }
}
