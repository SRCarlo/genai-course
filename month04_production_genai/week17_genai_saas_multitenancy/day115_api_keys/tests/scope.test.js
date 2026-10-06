import test from "node:test";
import assert from "node:assert/strict";
import { requireScope } from "../src/middleware/authorize-scope.js";

function fakeResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(value) {
      this.body = value;
      return this;
    }
  };
}

test("scope allows an authorized request", () => {
  const req = {
    identity: {
      scopes: ["chat:write"]
    }
  };

  const res = fakeResponse();
  let called = false;

  requireScope("chat:write")(req, res, () => {
    called = true;
  });

  assert.equal(called, true);
  assert.equal(res.statusCode, 200);
});

test("scope denies an unauthorized request", () => {
  const req = {
    identity: {
      scopes: ["chat:write"]
    }
  };

  const res = fakeResponse();
  let called = false;

  requireScope("agents:run")(req, res, () => {
    called = true;
  });

  assert.equal(called, false);
  assert.equal(res.statusCode, 403);
  assert.equal(res.body.error, "Insufficient scope");
});
