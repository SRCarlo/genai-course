import { validateAnswer } from '../ai/guardrails/answer-validator.js';

export class ChatService {
  constructor({ retriever, llm, usageService, entitlementService, maxContextCharacters = 16000 }) {
    this.retriever = retriever;
    this.llm = llm;
    this.usageService = usageService;
    this.entitlementService = entitlementService;
    this.maxContextCharacters = maxContextCharacters;
  }

  async ask({ tenantId, question, requestId = null }) {
    if (typeof tenantId !== 'string' || !tenantId || typeof question !== 'string' || !question.trim()) {
      throw new Error('INVALID_CHAT_REQUEST');
    }

    await this.entitlementService.requireFeature(tenantId, 'basicChat');

    const sources = await this.retriever.search({ tenantId, query: question.trim(), limit: 5 });
    if (!Array.isArray(sources) || sources.length === 0) {
      return {
        answer: 'I could not find relevant information in your documents.',
        sources: [],
        usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
      };
    }

    const context = sources
      .map((source, index) => `Source ${index + 1}: ${String(source.source)}\n${String(source.content)}`)
      .join('\n\n')
      .slice(0, this.maxContextCharacters);

    const result = await this.llm.generate({ question: question.trim(), context });
    const validation = validateAnswer(result.answer, sources);
    if (!validation.valid) throw new Error(validation.reason);

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

    await this.usageService.recordUsage({ tenantId, inputTokens, outputTokens, requestId });

    return {
      answer: validation.answer,
      sources: sources.map(({ id, source }) => ({ id, source })),
      usage: { inputTokens, outputTokens, totalTokens: inputTokens + outputTokens },
      model: result.model,
    };
  }
}
