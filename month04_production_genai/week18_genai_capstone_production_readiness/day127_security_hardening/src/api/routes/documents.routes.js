import { Router } from 'express';
import multer from 'multer';
import { randomUUID } from 'node:crypto';

const MAX_FILE_SIZE = 1024 * 1024; // 1 MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter(_req, file, callback) {
    if (!file.originalname.toLowerCase().endsWith('.txt')) {
      const error = new Error('UNSUPPORTED_FILE_TYPE');
      error.status = 415;
      return callback(error);
    }

    callback(null, true);
  },
});

export function createDocumentsRouter({ documents, tenantAccessService }) {
  const router = Router();

  router.post('/', (req, res, next) => {
    upload.single('file')(req, res, async (uploadError) => {
      if (uploadError) {
        if (uploadError.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({
            error: 'FILE_TOO_LARGE',
            requestId: req.requestId,
          });
        }

        if (uploadError.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            error: 'TOO_MANY_FILES',
            requestId: req.requestId,
          });
        }

        if (uploadError.status === 415) {
          return res.status(415).json({
            error: 'UNSUPPORTED_FILE_TYPE',
            requestId: req.requestId,
          });
        }

        return next(uploadError);
      }

      try {
        if (!req.auth?.userId || !req.auth?.tenantId) {
          return res.status(401).json({
            error: 'AUTHENTICATION_REQUIRED',
            requestId: req.requestId,
          });
        }

        await tenantAccessService.requireMembership({
          userId: req.auth.userId,
          tenantId: req.auth.tenantId,
        });

        if (!req.file) {
          return res.status(400).json({
            error: 'FILE_REQUIRED',
            requestId: req.requestId,
          });
        }

        const content = req.file.buffer.toString('utf8');

        if (!content.trim()) {
          return res.status(400).json({
            error: 'EMPTY_FILE',
            requestId: req.requestId,
          });
        }

        if (content.includes('\uFFFD')) {
          return res.status(400).json({
            error: 'INVALID_TEXT_ENCODING',
            requestId: req.requestId,
          });
        }

        const document = {
          id: `doc_${randomUUID()}`,
          tenantId: req.auth.tenantId,
          source: req.file.originalname,
          content,
        };

        documents.push(document);

        return res.status(201).json({
          document: {
            id: document.id,
            source: document.source,
          },
          requestId: req.requestId,
        });
      } catch (error) {
        return next(error);
      }
    });
  });

  return router;
}
