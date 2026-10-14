import test from 'node:test';
import assert from 'node:assert/strict';

import { ChatService } from '../src/application/chat.service.js';

function createService(overrides = {}) {
  const calls = {
    entitlement: [],
    retrieval: [],
    llm: [],
    usage: [],
  };

  const retriever = {
    async search(args) {
      calls.retrieval.push(args);

      return [
        {
          id: 'doc-a1',
          source: 'refund-policy.txt',
          content: 'Customers can request a refund within 30 days.',
        },
      ];
    },
  };

  const llm = {
    async generate(args) {
      calls.llm.push(args);

      return {
        answer: 'Customers can request a refund within 30 days.',
        model: 'test-model',
        usage: {
          inputTokens: 100,
          outputTokens: 20,
        },
      };
    },
  };

  const usageService = {
    async recordUsage(args) {
      calls.usage.push(args);
    },
  };

  const entitlementService = {
    async requireFeature(tenantId, feature) {
      calls.entitlement.push({ tenantId, feature });
    },
  };

  const service = new ChatService({
    retriever,
    llm,
    usageService,
    entitlementService,
    ...overrides,
  });

  return { service, calls };
}

test('successful chat retrieves tenant data and records usage', async () => {
  const { service, calls } = createService();

  const result = await service.ask({
    tenantId: 'tenant-a',
    question: 'How many days for a refund?',
    requestId: 'request-001',
  });

  assert.equal(result.answer, 'Customers can request a refund within 30 days.');
  assert.equal(result.sources.length, 1);

  assert.deepEqual(calls.entitlement, [
    {
      tenantId: 'tenant-a',
      feature: 'basicChat',
    },
  ]);

  assert.deepEqual(calls.retrieval, [
    {
      tenantId: 'tenant-a',
      query: 'How many days for a refund?',
      limit: 5,
    },
  ]);

  assert.equal(calls.llm.length, 1);

  assert.deepEqual(calls.usage, [
    {
      tenantId: 'tenant-a',
      inputTokens: 100,
      outputTokens: 20,
      requestId: 'request-001',
    },
  ]);

  assert.equal(result.usage.totalTokens, 120);
  assert.equal(result.model, 'test-model');
});

test('denied entitlement prevents retrieval and LLM calls', async () => {
  const entitlementService = {
    async requireFeature() {
      throw new Error('SUBSCRIPTION_ACCESS_DENIED');
    },
  };

  const { service, calls } = createService({
    entitlementService,
  });

  await assert.rejects(
    service.ask({
      tenantId: 'tenant-a',
      question: 'How many days for a refund?',
    }),
    { message: 'SUBSCRIPTION_ACCESS_DENIED' },
  );

  assert.equal(calls.retrieval.length, 0);
  assert.equal(calls.llm.length, 0);
  assert.equal(calls.usage.length, 0);
});

test('no retrieved documents returns fallback without calling LLM', async () => {
  const retriever = {
    async search() {
      return [];
    },
  };

  const { service, calls } = createService({ retriever });

  const result = await service.ask({
    tenantId: 'tenant-a',
    question: 'Unknown topic',
  });

  assert.equal(result.answer, 'I could not find relevant information in your documents.');
  assert.deepEqual(result.sources, []);
  assert.equal(calls.llm.length, 0);
  assert.equal(calls.usage.length, 0);
});

test('invalid provider token usage is rejected', async () => {
  const llm = {
    async generate() {
      return {
        answer: 'Customers can request a refund within 30 days.',
        model: 'test-model',
        usage: {
          inputTokens: -1,
          outputTokens: 20,
        },
      };
    },
  };

  const { service, calls } = createService({ llm });

  await assert.rejects(
    service.ask({
      tenantId: 'tenant-a',
      question: 'How many days for a refund?',
    }),
    { message: 'INVALID_PROVIDER_USAGE' },
  );

  assert.equal(calls.usage.length, 0);
});

test('invalid chat input is rejected before external calls', async () => {
  const { service, calls } = createService();

  await assert.rejects(
    service.ask({
      tenantId: '',
      question: 'Hello',
    }),
    { message: 'INVALID_CHAT_REQUEST' },
  );

  assert.equal(calls.entitlement.length, 0);
  assert.equal(calls.retrieval.length, 0);
  assert.equal(calls.llm.length, 0);
});
