import test from "node:test";
import assert from "node:assert/strict";
import { requestContext } from "../src/observability/request-context.js";

function createMockRequest(incomingId) {
  return {
    get(name) {
      return name.toLowerCase() === "x-request-id" ? incomingId : undefined;
    },
  };
}

function createMockResponse() {
  return {
    headers: {},
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
  };
}

test("preserves a valid request ID", () => {
  const req = createMockRequest("req_test_123");
  const res = createMockResponse();
  requestContext(req, res, () => {});
  assert.equal(req.requestId, "req_test_123");
  assert.equal(res.headers["x-request-id"], "req_test_123");
});

test("replaces an invalid request ID", () => {
  const req = createMockRequest("bad id with spaces");
  const res = createMockResponse();
  requestContext(req, res, () => {});
  assert.match(req.requestId, /^req_[0-9a-f-]{36}$/);
  assert.equal(res.headers["x-request-id"], req.requestId);
});

test("generates an ID when none is supplied", () => {
  const req = createMockRequest(undefined);
  const res = createMockResponse();
  requestContext(req, res, () => {});
  assert.match(req.requestId, /^req_[0-9a-f-]{36}$/);
  assert.equal(res.headers["x-request-id"], req.requestId);
});
