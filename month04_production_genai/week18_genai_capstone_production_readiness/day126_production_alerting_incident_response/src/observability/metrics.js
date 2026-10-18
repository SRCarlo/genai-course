
import { logger } from './logger.js';

export function recordOperation({
  requestId,
  operation,
  durationMs,
  success,
  tenantId,
  status,
  resultCount,
  outcome,
  errorCode,
}) {
  logger.info({
    event: 'operation_completed',
    requestId,
    operation,
    durationMs: Math.round(durationMs * 100) / 100,
    success: success ?? status === 'success',
    ...(status ? { status } : {}),
    ...(tenantId ? { tenantId } : {}),
    ...(Number.isFinite(resultCount) ? { resultCount } : {}),
    ...(outcome ? { outcome } : {}),
    ...(errorCode ? { errorCode } : {}),
  });
}

export function recordModelUsage({
  requestId,
  provider,
  model,
  durationMs,
  inputTokens,
  outputTokens,
  success,
  totalTokens,
}) {
  logger.info({
    event: 'model_call_completed',
    requestId,
    provider,
    model,
    ...(Number.isFinite(durationMs)
      ? { durationMs: Math.round(durationMs * 100) / 100 }
      : {}),
    inputTokens,
    outputTokens,
    totalTokens: totalTokens ?? inputTokens + outputTokens,
    success: success ?? true,
  });
}
