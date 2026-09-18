import { z } from "zod";

const documentSchema = z.object({
  name: z.string().trim().min(1).max(255),

  content: z.string().trim().min(1),
});

export function createDocumentController(documentService) {
  return async function documentController(req, res, next) {
    try {
      const input = documentSchema.parse(req.body);

      const result = await documentService.ingest({
        name: input.name,

        content: input.content,

        tenantId: req.user.tenantId,

        ownerId: req.user.id,

        mimeType: "text/plain",
      });

      res.status(201).json({
        message: "Document ingested successfully",

        document: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
