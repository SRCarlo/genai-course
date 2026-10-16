import { performance } from 'node:perf_hooks';
import { validateAnswer } from '../ai/guardrails/answer-validator.js';
import { recordOperation, recordModelUsage } from '../observability/metrics.js';
import { traceRetrieval, traceGeneration } from '../observability/chat-tracing.js';

export class ChatService {
  constructor({ retriever, llm, usageService, entitlementService, maxContextCharacters = 16000 }) {
    this.retriever = retriever;
    this.llm = llm;
    this.usageService = usageService;
    this.entitlementService = entitlementService;
    this.maxContextCharacters = maxContextCharacters;
  }

  async ask({ tenantId, question, requestId = null }) {
    const totalStart = performance.now();

    const logContext = {
      requestId,
      operation: 'chat.ask',
    };

    try {
      if (
        typeof tenantId !== 'string' ||
        !tenantId ||
        typeof question !== 'string' ||
        !question.trim()
      ) {
        throw new Error('INVALID_CHAT_REQUEST');
      }

      await this.entitlementService.requireFeature(tenantId, 'basicChat');

      const retrievalStart = performance.now();
      let sources;

      try {
        sources = await traceRetrieval(
          () =>
            this.retriever.search({
              tenantId,
              query: question.trim(),
              limit: 5,
            }),
          {
            'app.request_id': requestId,
          },
        );

        recordOperation({
          ...logContext,
          operation: 'retrieval',
          durationMs: Number((performance.now() - retrievalStart).toFixed(2)),
          status: 'success',
          resultCount: Array.isArray(sources) ? sources.length : 0,
        });
      } catch (error) {
        recordOperation({
          ...logContext,
          operation: 'retrieval',
          durationMs: Number((performance.now() - retrievalStart).toFixed(2)),
          status: 'error',
          errorCode: 'RETRIEVAL_FAILED',
        });

        throw error;
      }

      if (!Array.isArray(sources) || sources.length === 0) {
        const durationMs = Number((performance.now() - totalStart).toFixed(2));

        recordOperation({
          ...logContext,
          durationMs,
          status: 'success',
          outcome: 'no_sources',
        });

        return {
          answer: 'I could not find relevant information in your documents.',
          sources: [],
          usage: {
            inputTokens: 0,
            outputTokens: 0,
            totalTokens: 0,
          },
        };
      }

      const context = sources
        .map(
          (source, index) =>
            `Source ${index + 1}: ${String(source.source)}\n${String(source.content)}`,
        )
        .join('\n\n')
        .slice(0, this.maxContextCharacters);

      const modelStart = performance.now();
      let result;

      try {
        result = await traceGeneration(
          () =>
            this.llm.generate({
              question: question.trim(),
              context,
            }),
          {
            'app.request_id': requestId,
            'genai.provider': 'groq',
          },
        );

        recordOperation({
          ...logContext,
          operation: 'model.generate',
          durationMs: Number((performance.now() - modelStart).toFixed(2)),
          status: 'success',
        });
      } catch (error) {
        recordOperation({
          ...logContext,
          operation: 'model.generate',
          durationMs: Number((performance.now() - modelStart).toFixed(2)),
          status: 'error',
          errorCode: 'MODEL_GENERATION_FAILED',
        });

        throw error;
      }

      const validation = validateAnswer(result.answer, sources);

      if (!validation.valid) {
        throw new Error(validation.reason);
      }

      const inputTokens = result.usage?.inputTokens;
      const outputTokens = result.usage?.outputTokens;

      if (
        !Number.isSafeInteger(inputTokens) ||
        !Number.isSafeInteger(outputTokens) ||
        inputTokens < 0 ||
        outputTokens < 0
      ) {
        throw new Error('INVALID_PROVIDER_USAGE');
      }

      await this.usageService.recordUsage({
        tenantId,
        inputTokens,
        outputTokens,
        requestId,
      });

      recordModelUsage({
        ...logContext,
        model: result.model,
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens,
      });

      const durationMs = Number((performance.now() - totalStart).toFixed(2));

      recordOperation({
        ...logContext,
        durationMs,
        status: 'success',
      });

      return {
        answer: validation.answer,
        sources: sources.map(({ id, source }) => ({ id, source })),
        usage: {
          inputTokens,
          outputTokens,
          totalTokens: inputTokens + outputTokens,
        },
        model: result.model,
      };
    } catch (error) {
      recordOperation({
        ...logContext,
        durationMs: Number((performance.now() - totalStart).toFixed(2)),
        status: 'error',
        errorCode:
          typeof error?.message === 'string' && /^[A-Z0-9_]{1,80}$/.test(error.message)
            ? error.message
            : 'CHAT_OPERATION_FAILED',
      });

      throw error;
    }
  }
}
