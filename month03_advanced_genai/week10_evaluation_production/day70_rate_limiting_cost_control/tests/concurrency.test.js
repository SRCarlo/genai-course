import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";

import {
  concurrencyLimiter,
  resetConcurrency,
} from "../src/middleware/concurrency.js";

function createRequest(userId = "user_test") {
  return {
    user: {
      id: userId,
      planName: "free",
      plan: {
        maxConcurrentRequests: 2,
      },
    },

    ip: "127.0.0.1",
  };
}

function createResponse() {
  return {
    statusCode: 200,
    body: null,

    listeners: {},

    on(event, callback) {
      this.listeners[event] = callback;
      return this;
    },

    status(code) {
      this.statusCode = code;
      return this;
    },

    json(data) {
      this.body = data;
      return this;
    },
  };
}

beforeEach(() => {
  resetConcurrency();
});

test("first concurrent request is allowed", () => {
  const req = createRequest();
  const res = createResponse();

  let nextCalled = false;

  concurrencyLimiter(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(res.statusCode, 200);
});

test("maximum of two concurrent requests is allowed", () => {
  const req1 = createRequest();
  const req2 = createRequest();

  const res1 = createResponse();
  const res2 = createResponse();

  let next1 = false;
  let next2 = false;

  concurrencyLimiter(req1, res1, () => {
    next1 = true;
  });

  concurrencyLimiter(req2, res2, () => {
    next2 = true;
  });

  assert.equal(next1, true);
  assert.equal(next2, true);
});

test("third concurrent request should be rejected", () => {
  const req1 = createRequest();
  const req2 = createRequest();
  const req3 = createRequest();

  const res1 = createResponse();
  const res2 = createResponse();
  const res3 = createResponse();

  concurrencyLimiter(req1, res1, () => {});
  concurrencyLimiter(req2, res2, () => {});

  let next3 = false;

  concurrencyLimiter(req3, res3, () => {
    next3 = true;
  });

  assert.equal(next3, false);
  assert.equal(res3.statusCode, 429);

  assert.equal(res3.body.error, "concurrency_limit_exceeded");
});

test("slot is released after response finishes", () => {
  const req1 = createRequest();
  const req2 = createRequest();
  const req3 = createRequest();

  const res1 = createResponse();
  const res2 = createResponse();
  const res3 = createResponse();

  concurrencyLimiter(req1, res1, () => {});
  concurrencyLimiter(req2, res2, () => {});

  assert.equal(res1.statusCode, 200);

  res1.listeners.finish();

  let next3 = false;

  concurrencyLimiter(req3, res3, () => {
    next3 = true;
  });

  assert.equal(next3, true);
});
