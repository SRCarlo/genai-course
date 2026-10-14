import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('HTTP API', () => {
  let app;
  beforeAll(() => {
    app = createApp({
      llm: {
        async generate() {
          return {
            answer: 'The platform supports document search.',
            usage: { inputTokens: 12, outputTokens: 8 },
            model: 'openai/gpt-oss-20b',
          };
        },
      },
    });
  });
  it('returns health status', async () => {
    const response = await request(app).get('/health').expect(200);
    expect(response.body.status).toBe('ok');
  });

  it('requires a demo tenant identity for chat', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ question: 'What is the platform?' })
      .expect(401);
    expect(response.body.error).toBe('AUTHENTICATION_REQUIRED');
  });

  it('returns answer, source references, usage, and request ID', async () => {
    const response = await request(app)
      .post('/api/chat')
      .set('x-demo-tenant-id', 'tenant_demo')
      .set('x-demo-user-id', 'user_demo')
      .send({ question: 'What does the platform provide?' })
      .expect(200);

    expect(response.body.answer).toContain('document search');
    expect(response.body.sources.length).toBeGreaterThan(0);
    expect(response.body.usage.totalTokens).toBe(20);
    expect(response.headers['x-request-id']).toBeTruthy();
  });

  it('rejects empty questions', async () => {
    const response = await request(app)
      .post('/api/chat')
      .set('x-demo-tenant-id', 'tenant_demo')
      .set('x-demo-user-id', 'user_demo')
      .send({ question: '  ' })
      .expect(400);
    expect(response.body.error).toBe('INVALID_QUESTION');
  });

  it('does not allow a user to access an unapproved tenant', async () => {
    const response = await request(app)
      .post('/api/chat')
      .set('x-demo-tenant-id', 'tenant_other')
      .set('x-demo-user-id', 'user_demo')
      .send({ question: 'private policy' })
      .expect(403);
    expect(response.body.error).toBe('TENANT_ACCESS_DENIED');
  });
});
