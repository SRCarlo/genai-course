import test from "node:test";
import assert from "node:assert/strict";

import { ApiKeyService } from "../src/auth/api-key.js";

function createTestService() {
  return new ApiKeyService([
    {
      key: "test-acme-key",
      tenantId: "tenant-acme",
      userId: "user-001",
      role: "tenant_admin"
    },
    {
      key: "test-beta-key",
      tenantId: "tenant-beta",
      userId: "user-002",
      role: "member"
    }
  ]);
}

test("valid API key is accepted", () => {
  const service = createTestService();

  const identity = service.authenticate("test-acme-key");

  assert.equal(identity.tenantId, "tenant-acme");
  assert.equal(identity.userId, "user-001");
});

test("invalid API key is rejected", () => {
  const service = createTestService();

  assert.throws(
    () => service.authenticate("definitely-invalid-api-key"),
    /Invalid API key/
  );
});

test("revoked API key is rejected", () => {
  const service = createTestService();

  service.revoke("test-beta-key");

  assert.throws(
    () => service.authenticate("test-beta-key"),
    /API key is disabled/
  );
});
