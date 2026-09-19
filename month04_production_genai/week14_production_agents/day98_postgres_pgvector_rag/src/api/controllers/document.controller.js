export function createDocumentController(documentService) {
  return {
    create: async (req, res, next) => {
      try {
        const { name, mimeType, content } = req.body;

        if (!name || !content) {
          return res.status(400).json({
            error: "name and content are required"
          });
        }

        const document = await documentService.create({
          tenantId: req.auth.tenantId,
          name,
          mimeType,
          content
        });

        res.status(202).json({
          message: "Document accepted for asynchronous ingestion.",
          document
        });
      } catch (error) {
        next(error);
      }
    },

    getById: async (req, res, next) => {
      try {
        const document = await documentService.getById(
          req.params.id,
          req.auth.tenantId
        );

        if (!document) {
          return res.status(404).json({ error: "Document not found" });
        }

        res.json({ document });
      } catch (error) {
        next(error);
      }
    },

    list: async (req, res, next) => {
      try {
        const documents = await documentService.list(req.auth.tenantId);
        res.json({ documents });
      } catch (error) {
        next(error);
      }
    },

    remove: async (req, res, next) => {
      try {
        const deleted = await documentService.delete(
          req.params.id,
          req.auth.tenantId
        );

        if (!deleted) {
          return res.status(404).json({ error: "Document not found" });
        }

        res.json({
          message: "Document deleted.",
          document: deleted
        });
      } catch (error) {
        next(error);
      }
    }
  };
}
