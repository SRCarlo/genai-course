import test from 'node:test';
import assert from 'node:assert/strict';
import { MockRetriever } from '../src/ai/retrieval/retriever.js';

const documents = [
  {
    id: 'doc-a1',
    tenantId: 'tenant-a',
    source: 'refund-policy.txt',
    content: 'Customers can request a refund within 30 days.',
  },
  {
    id: 'doc-b1',
    tenantId: 'tenant-b',
    source: 'refund-policy.txt',
    content: 'Customers can request a refund within 60 days.',
  },
  {
    id: 'doc-a2',
    tenantId: 'tenant-a',
    source: 'shipping-policy.txt',
    content: 'Standard shipping takes 3 to 5 business days.',
  },
];

test('tenant A receives only tenant A documents', async () => {
  const retriever = new MockRetriever(documents);

  const results = await retriever.search({
    tenantId: 'tenant-a',
    query: 'refund',
  });

  assert.equal(results.length, 1);
  assert.equal(results[0].id, 'doc-a1');
  assert.ok(results.every((doc) => doc.id !== 'doc-b1'));
});

test('tenant B receives only tenant B documents', async () => {
  const retriever = new MockRetriever(documents);

  const results = await retriever.search({
    tenantId: 'tenant-b',
    query: 'refund',
  });

  assert.equal(results.length, 1);
  assert.equal(results[0].id, 'doc-b1');
  assert.ok(results.every((doc) => doc.id !== 'doc-a1'));
});

test("unknown tenant cannot retrieve another tenant's documents", async () => {
  const retriever = new MockRetriever(documents);

  const results = await retriever.search({
    tenantId: 'tenant-unknown',
    query: 'refund',
  });

  assert.deepEqual(results, []);
});

test('retrieval respects the requested result limit', async () => {
  const retriever = new MockRetriever(documents);

  const results = await retriever.search({
    tenantId: 'tenant-a',
    query: 'shipping',
    limit: 1,
  });

  assert.equal(results.length, 1);
  assert.equal(results[0].id, 'doc-a2');
});

test('retrieval rejects a missing tenant ID', async () => {
  const retriever = new MockRetriever(documents);

  await assert.rejects(
    retriever.search({
      tenantId: '',
      query: 'refund',
    }),
    { message: 'INVALID_RETRIEVAL_REQUEST' },
  );
});
