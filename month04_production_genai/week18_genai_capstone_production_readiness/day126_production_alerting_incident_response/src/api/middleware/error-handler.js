import { logger } from '../../observability/logger.js';

const knownErrors = new Map([
  ['INVALID_CHAT_REQUEST', 400],
  ['INVALID_QUESTION', 400],
  ['INVALID_RETRIEVAL_REQUEST', 400],
  ['AUTHENTICATION_REQUIRED', 401],
  ['TENANT_ACCESS_DENIED', 403],
  ['SUBSCRIPTION_ACCESS_DENIED', 403],
  ['FEATURE_NOT_ENTITLED', 403],
  ['INVALID_ENTITLEMENT_REQUEST', 400],
  ['GROQ_API_KEY_MISSING', 503],
  ['LLM_PROVIDER_AUTH_FAILED', 502],
  ['LLM_PROVIDER_RATE_LIMITED', 503],
  ['LLM_PROVIDER_TIMEOUT', 504],
  ['LLM_PROVIDER_FAILED', 502],
  ['EMPTY_PROVIDER_RESPONSE', 502],
  ['EMPTY_ANSWER', 502],
  ['NO_SUPPORTING_SOURCES', 502],
  ['INVALID_PROVIDER_USAGE', 502],
  ['INVALID_USAGE', 500],
]);

export function errorHandler(error, req, res, _next) {
  const status = knownErrors.get(error.message) ?? 500;
  if (status >= 500) {
    logger.error({ err: { name: error.name, code: error.message }, requestId: req.requestId }, 'Request failed');
  }

  return res.status(status).json({
    error: status === 500 ? 'INTERNAL_SERVER_ERROR' : error.message,
    requestId: req.requestId ?? null,
  });
}
