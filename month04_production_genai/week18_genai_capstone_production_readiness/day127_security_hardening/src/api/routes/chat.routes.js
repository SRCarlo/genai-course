
import { Router } from 'express';
import { z } from 'zod';

export function createChatRouter({
  chatService,
  tenantAccessService,
  maxQuestionLength = 4000,
}) {
  const router = Router();

  const questionSchema = z.object({
    question: z.string().trim().min(1).max(maxQuestionLength),
  });

  router.post('/', async (req, res, next) => {
    try {
      if (!req.auth?.userId || !req.auth?.tenantId) {
        return res.status(401).json({
          error: 'AUTHENTICATION_REQUIRED',
          requestId: req.requestId,
        });
      }

      const parsed = questionSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          error: 'INVALID_QUESTION',
          requestId: req.requestId,
        });
      }

      await tenantAccessService.requireMembership({
        userId: req.auth.userId,
        tenantId: req.auth.tenantId,
      });

      const result = await chatService.ask({
        tenantId: req.auth.tenantId,
        question: parsed.data.question,
        requestId: req.requestId,
      });

      return res.status(200).json({
        ...result,
        requestId: req.requestId,
      });
    } catch (error) {
      return next(error);
    }
  });

  return router;
}
