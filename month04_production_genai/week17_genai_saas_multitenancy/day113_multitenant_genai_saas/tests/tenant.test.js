import test from "node:test";
import assert from "node:assert/strict";

import { TenantRegistry } from "../src/tenants/tenant-registry.js";
import { TenantResolver } from "../src/tenants/tenant-resolver.js";

test("resolves an active tenant", () => {
  const registry = new TenantRegistry();
  const resolver = new TenantResolver(registry);

  const tenant = resolver.resolve("tenant-acme");

  assert.equal(tenant.id, "tenant-acme");
  assert.equal(tenant.status, "active");
});

test("rejects unknown tenant", () => {
  const registry = new TenantRegistry();
  const resolver = new TenantResolver(registry);

  assert.throws(
    () => resolver.resolve("tenant-does-not-exist"),
    /Tenant not found/
  );
});