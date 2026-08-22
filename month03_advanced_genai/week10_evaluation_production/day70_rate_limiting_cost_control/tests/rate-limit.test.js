import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";

import {
  rateLimiter,
  resetRateLimits,
} from "../src/middleware/rateLimiter.js";


function createRequest({
  userId = "user_test",
  ip = "127.0.0.1",
  planName = "free",
} = {}) {
  return {
    user: {
      id: userId,
      planName,
    },
    ip,
  };
}


function createResponse() {
  const headers = {};

  return {
    statusCode: 200,
    body: null,

    headers,

    setHeader(name, value) {
      headers[name] = value;
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
  resetRateLimits();
});


test("first request should be allowed", () => {
  const req = createRequest();
  const res = createResponse();

  let nextCalled = false;

  rateLimiter(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(res.statusCode, 200);
});


test("free plan allows 10 requests per minute", () => {
  const req = createRequest();
  const res = createResponse();

  for (let i = 0; i < 10; i++) {
    rateLimiter(req, res, () => {});
  }

  assert.equal(
    res.headers["X-RateLimit-Limit"],
    10
  );

  assert.equal(
    res.headers["X-RateLimit-Remaining"],
    0
  );
});


test("11th request should return 429", () => {
  const req = createRequest();
  const res = createResponse();

  for (let i = 0; i < 11; i++) {
    rateLimiter(req, res, () => {});
  }

  assert.equal(res.statusCode, 429);

  assert.equal(
    res.body.error,
    "rate_limit_exceeded"
  );

  assert.ok(
    res.headers["Retry-After"]
  );
});


test("different users have separate rate limits", () => {
  const user1 = createRequest({
    userId: "user_1",
  });

  const user2 = createRequest({
    userId: "user_2",
  });

  const res1 = createResponse();
  const res2 = createResponse();

  for (let i = 0; i < 10; i++) {
    rateLimiter(user1, res1, () => {});
  }

  rateLimiter(user2, res2, () => {});

  assert.equal(res2.statusCode, 200);
});