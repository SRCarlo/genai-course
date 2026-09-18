import { loadDocument } from "../ingestion/loader.js";
import { cleanText } from "../ingestion/cleaner.js";
import { chunkText } from "../ingestion/chunker.js";

export class DocumentService {
  constructor({ documentRepository, embeddingService, vectorRepository }) {
    this.documentRepository = documentRepository;

    this.embeddingService = embeddingService;

    this.vectorRepository = vectorRepository;
  }

  async ingest({ name, content, tenantId, ownerId, mimeType }) {
    const document = await this.documentRepository.create({
      name,
      content,
      tenantId,
      ownerId,
      mimeType,
    });

    try {
      await this.documentRepository.updateStatus(document.id, "processing");

      const rawText = await loadDocument(content);

      const cleanedText = cleanText(rawText);

      const chunks = chunkText(cleanedText, 500, 50);

      if (!chunks.length) {
        throw new Error("DOCUMENT_EMPTY");
      }

      const embeddings = await this.embeddingService.embedMany(chunks);

      const records = chunks.map((chunk, index) => ({
        id: `${document.id}-chunk-${index}`,

        documentId: document.id,

        chunkIndex: index,

        content: chunk,

        embedding: embeddings[index],

        metadata: {
          source: name,

          page: null,

          tenantId,

          ownerId,
        },
      }));

      await this.vectorRepository.upsert(records);

      await this.documentRepository.updateStatus(document.id, "ready");

      return {
        ...document,
        status: "ready",
        chunks: chunks.length,
      };
    } catch (error) {
      await this.documentRepository.updateStatus(
        document.id,
        "failed",
        error.message,
      );

      throw error;
    }
  }
}
