import test from "node:test";
import assert from "node:assert/strict";
import { requireTenantResource } from "../src/middleware/tenant-boundary.js";

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

test("tenant A can access tenant A resource", () => {
  const req = {
    identity: { tenantId: "tenant-a" },
    body: { tenantId: "tenant-a" },
    params: {},
    query: {}
  };

  const res = fakeResponse();
  let called = false;

  requireTenantResource()(req, res, () => {
    called = true;
  });

  assert.equal(called, true);
  assert.equal(res.statusCode, 200);
});

test("tenant A cannot access tenant B resource", () => {
  const req = {
    identity: { tenantId: "tenant-a" },
    body: { tenantId: "tenant-b" },
    params: {},
    query: {}
  };

  const res = fakeResponse();
  let called = false;

  requireTenantResource()(req, res, () => {
    called = true;
  });

  assert.equal(called, false);
  assert.equal(res.statusCode, 403);
});
