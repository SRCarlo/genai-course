
import express from 'express';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import pinoHttp from 'pino-http';

import { config } from './config/config.js';
import { createChatRouter } from './api/routes/chat.routes.js';
import { errorHandler } from './api/middleware/error-handler.js';
import { requestContext } from './api/middleware/request-context.js';
import { createDemoAuth } from './api/middleware/demo-auth.js';
import { ChatService } from './application/chat.service.js';
import { MockRetriever } from './ai/retrieval/retriever.js';
import { GroqLLMAdapter } from './ai/llm/llm.adapter.js';
import { InMemoryUsageService } from './usage/usage.service.js';
import { EntitlementService } from './entitlements/entitlement.service.js';
import { TenantAccessService } from './tenancy/tenant-access.js';
import { logger } from './observability/logger.js';
import { createDocumentsRouter } from './api/routes/documents.routes.js';

export function createApp(overrides = {}) {
  const app = express();

  const demoAuthEnabled =
    config.nodeEnv !== 'production' && overrides.demoAuthEnabled !== false;

  const documents = overrides.documents ?? [
    {
      id: 'doc_1',
      tenantId: 'tenant_demo',
      source: 'getting-started.txt',
      content:
        'Our platform provides document search and AI chat for organization knowledge.',
    },
    {
      id: 'doc_2',
      tenantId: 'tenant_other',
      source: 'private-policy.txt',
      content:
        'This private document belongs to a different organization and must not be returned.',
    },
  ];

  const membershipRepository = overrides.membershipRepository ?? {
    async findMembership({ userId, tenantId }) {
      if (userId === 'user_demo' && tenantId === 'tenant_demo') {
        return { userId, tenantId, role: 'owner' };
      }

      return null;
    },
  };

  const subscriptionRepository = overrides.subscriptionRepository ?? {
    async findByTenantId(tenantId) {
      if (tenantId !== 'tenant_demo') return null;

      return {
        tenantId,
        status: 'active',
        planId: 'demo',
        features: { basicChat: true },
      };
    },
  };

  const tenantAccessService =
    overrides.tenantAccessService ??
    new TenantAccessService(membershipRepository);

  const entitlementService =
    overrides.entitlementService ??
    new EntitlementService(subscriptionRepository);

  const usageService =
    overrides.usageService ?? new InMemoryUsageService();

  const retriever =
    overrides.retriever ?? new MockRetriever(documents);

  const llm =
    overrides.llm ??
    new GroqLLMAdapter({
      apiKey: config.groqApiKey,
      model: config.groqModel,
      timeoutMs: config.groqTimeoutMs,
    });

  const chatService =
    overrides.chatService ??
    new ChatService({
      retriever,
      llm,
      usageService,
      entitlementService,
      maxContextCharacters: config.maxContextCharacters,
    });

  app.disable('x-powered-by');

  app.use(helmet());

  app.use((req, res, next) => {
    const allowedOrigin = config.corsOrigin;
    const origin = req.get('origin');

    if (origin && (allowedOrigin === '*' || origin === allowedOrigin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');

      res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, X-Request-Id, X-Demo-Tenant-Id, X-Demo-User-Id',
      );

      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    }

    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }

    return next();
  });

  app.use(express.json({ limit: '1mb', strict: true }));

  // Generate or validate the request ID before HTTP logging.
  app.use(requestContext);

  // Structured HTTP request logging.
  app.use(
    pinoHttp({
      logger,
      genReqId: (req) => req.requestId,

      customLogLevel(_req, res, error) {
        if (error || res.statusCode >= 500) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
      },

      redact: [
        'req.headers.authorization',
        'req.headers.cookie',
      ],

      serializers: {
        req(req) {
          return {
            id: req.id,
            method: req.method,
            url: req.url,
            requestId: req.raw?.requestId,
          };
        },
      },
    }),
  );

  // Existing health endpoint.
  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      model: config.groqModel,
    });
  });

  // Liveness: confirms the Express process can respond.
  app.get('/health/live', (_req, res) => {
    res.status(200).json({
      status: 'alive',
    });
  });

  // Basic readiness endpoint.
  // This does not verify Groq API or other external dependencies.
  app.get('/health/ready', (_req, res) => {
    res.status(200).json({
      status: 'ready',
    });
  });

  app.use(createDemoAuth({ enabled: demoAuthEnabled }));

  const chatLimiter = rateLimit({
    windowMs: config.chatRateLimitWindowMs,
    limit: config.chatRateLimitMax,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'RATE_LIMIT_EXCEEDED' },
  });

  const uploadLimiter = rateLimit({
    windowMs: config.chatRateLimitWindowMs,
    limit: config.chatRateLimitMax,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'RATE_LIMIT_EXCEEDED' },
  });

  app.use(
    '/api/documents',
    uploadLimiter,
    createDocumentsRouter({
      documents,
      tenantAccessService,
    }),
  );

  app.use(
    '/api/chat',
    chatLimiter,
    createChatRouter({
      chatService,
      tenantAccessService,
      maxQuestionLength: config.maxQuestionLength,
    }),
  );

  app.use((_req, res) => {
    res.status(404).json({ error: 'NOT_FOUND' });
  });

  app.use(errorHandler);

  return app;
}

export const app = createApp();
