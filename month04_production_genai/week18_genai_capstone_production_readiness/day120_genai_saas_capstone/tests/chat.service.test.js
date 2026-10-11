import { describe, expect, it, vi } from 'vitest';
import { ChatService } from '../src/application/chat.service.js';

describe('ChatService', () => {
  it('retrieves tenant documents, generates an answer, and records usage', async () => {
    const retriever = {
      search: vi.fn().mockResolvedValue([
        { id: 'doc_1', source: 'guide.txt', content: 'The platform supports AI chat.' },
      ]),
    };
    const llm = {
      generate: vi.fn().mockResolvedValue({
        answer: 'The platform supports AI chat.',
        usage: { inputTokens: 100, outputTokens: 20 },
        model: 'openai/gpt-oss-20b',
      }),
    };
    const usageService = { recordUsage: vi.fn().mockResolvedValue({}) };
    const entitlementService = { requireFeature: vi.fn().mockResolvedValue({}) };
    const service = new ChatService({ retriever, llm, usageService, entitlementService });

    const result = await service.ask({
      tenantId: 'tenant_demo',
      question: 'What does the platform support?',
      requestId: 'req_test',
    });

    expect(entitlementService.requireFeature.mock.invocationCallOrder[0]).toBeLessThan(
      retriever.search.mock.invocationCallOrder[0],
    );
    expect(retriever.search).toHaveBeenCalledWith({
      tenantId: 'tenant_demo',
      query: 'What does the platform support?',
      limit: 5,
    });
    expect(result.sources).toEqual([{ id: 'doc_1', source: 'guide.txt' }]);
    expect(result.usage.totalTokens).toBe(120);
    expect(usageService.recordUsage).toHaveBeenCalledWith({
      tenantId: 'tenant_demo',
      inputTokens: 100,
      outputTokens: 20,
      requestId: 'req_test',
    });
  });

  it('does not call the LLM when no documents are found', async () => {
    const llm = { generate: vi.fn() };
    const service = new ChatService({
      retriever: { search: vi.fn().mockResolvedValue([]) },
      llm,
      usageService: { recordUsage: vi.fn() },
      entitlementService: { requireFeature: vi.fn().mockResolvedValue({}) },
    });

    const result = await service.ask({ tenantId: 'tenant_demo', question: 'Unknown topic' });
    expect(llm.generate).not.toHaveBeenCalled();
    expect(result.sources).toEqual([]);
    expect(result.usage.totalTokens).toBe(0);
  });

  it('does not call the LLM if entitlement is denied', async () => {
    const llm = { generate: vi.fn() };
    const service = new ChatService({
      retriever: { search: vi.fn() },
      llm,
      usageService: { recordUsage: vi.fn() },
      entitlementService: {
        requireFeature: vi.fn().mockRejectedValue(new Error('SUBSCRIPTION_ACCESS_DENIED')),
      },
    });

    await expect(service.ask({ tenantId: 'tenant_demo', question: 'Hello' })).rejects.toThrow(
      'SUBSCRIPTION_ACCESS_DENIED',
    );
    expect(llm.generate).not.toHaveBeenCalled();
  });

  it('rejects invalid provider usage instead of recording it', async () => {
    const usageService = { recordUsage: vi.fn() };
    const service = new ChatService({
      retriever: {
        search: vi.fn().mockResolvedValue([{ id: '1', source: 'a.txt', content: 'hello' }]),
      },
      llm: {
        generate: vi.fn().mockResolvedValue({
          answer: 'hello',
          usage: { inputTokens: -1, outputTokens: 2 },
        }),
      },
      usageService,
      entitlementService: { requireFeature: vi.fn().mockResolvedValue({}) },
    });
    await expect(service.ask({ tenantId: 'tenant_demo', question: 'hello' })).rejects.toThrow(
      'INVALID_PROVIDER_USAGE',
    );
    expect(usageService.recordUsage).not.toHaveBeenCalled();
  });
});
