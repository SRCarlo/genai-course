import test from "node:test";
import assert from "node:assert/strict";

import { quotaCheck } from "../src/middleware/quota.js";


function createRequest({
  planName = "free",
  monthlyTokens = 0,
  maxOutputTokens = 100,
} = {}) {
  return {
    user: {
      id: "user_test",
      tenantId: "tenant_test",
      planName,
      monthlyTokens,
    },

    body: {
      maxOutputTokens,
    },
  };
}


function createResponse() {
  return {
    statusCode: 200,
    body: null,

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


test("request within monthly quota should pass", () => {
  const req = createRequest({
    monthlyTokens: 99_000,
  });

  const res = createResponse();

  let nextCalled = false;

  quotaCheck(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(res.statusCode, 200);
});


test("request at monthly quota should be rejected", () => {
  const req = createRequest({
    monthlyTokens: 100_000,
  });

  const res = createResponse();

  quotaCheck(req, res, () => {});

  assert.equal(res.statusCode, 429);

  assert.equal(
    res.body.error,
    "quota_exceeded"
  );
});


test("output token limit should be enforced", () => {
  const req = createRequest({
    maxOutputTokens: 1000,
  });

  const res = createResponse();

  quotaCheck(req, res, () => {});

  assert.equal(res.statusCode, 400);

  assert.equal(
    res.body.error,
    "max_output_tokens_exceeded"
  );
});


test("free plan allows 512 output tokens", () => {
  const req = createRequest({
    maxOutputTokens: 512,
  });

  const res = createResponse();

  let nextCalled = false;

  quotaCheck(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
});