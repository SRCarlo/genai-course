import { randomUUID } from "node:crypto";
import { cleanText } from "./cleaner.js";
import { chunkText } from "./chunker.js";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class IngestionWorker {
  constructor({
    documentRepository,
    vectorRepository,
    embeddingService,
    maxRetries = 3
  }) {
    this.documentRepository = documentRepository;
    this.vectorRepository = vectorRepository;
    this.embeddingService = embeddingService;
    this.maxRetries = maxRetries;
  }

  async process(job) {
    const { documentId, tenantId } = job;

    try {
      const document = await this.documentRepository.findById(
        documentId,
        tenantId
      );

      if (!document) {
        return;
      }

      await this.documentRepository.updateStatus(
        documentId,
        tenantId,
        "PROCESSING"
      );

      const cleaned = cleanText(document.content);
      const chunks = chunkText(cleaned);

      if (!chunks.length) {
        throw new Error("DOCUMENT_HAS_NO_TEXT");
      }

      const vectors = await this.embeddingService.embedMany(
        chunks.map((chunk) => chunk.content)
      );

      const records = chunks.map((chunk, index) => ({
        id: randomUUID(),
        documentId,
        tenantId,
        chunkIndex: chunk.index,
        content: chunk.content,
        embedding: vectors[index],
        metadata: {
          documentName: document.name,
          chunkIndex: chunk.index
        }
      }));

      await this.vectorRepository.deleteByDocumentId(documentId, tenantId);
      await this.vectorRepository.insertMany(records);

      await this.documentRepository.updateStatus(
        documentId,
        tenantId,
        "READY"
      );

      console.log(
        JSON.stringify({
          event: "document_ingestion_completed",
          documentId,
          tenantId,
          chunkCount: records.length
        })
      );
    } catch (error) {
      const retryCount = await this.documentRepository.incrementRetry(
        documentId,
        tenantId
      );

      console.error(
        JSON.stringify({
          event: "document_ingestion_failed",
          documentId,
          tenantId,
          retryCount,
          error: error.message
        })
      );

      if (retryCount < this.maxRetries) {
        await this.documentRepository.updateStatus(
          documentId,
          tenantId,
          "UPLOADED",
          error.message
        );

        const delay = Math.min(1000 * 2 ** (retryCount - 1), 8000);
        await sleep(delay);

        return this.process({
          documentId,
          tenantId
        });
      }

      await this.documentRepository.updateStatus(
        documentId,
        tenantId,
        "FAILED",
        error.message
      );
    }
  }
}
