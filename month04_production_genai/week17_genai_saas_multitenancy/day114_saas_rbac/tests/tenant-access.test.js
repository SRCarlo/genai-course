import test from "node:test";
import assert from "node:assert/strict";
import { TenantAccessService } from "../src/tenants/tenant-access.js";
import { RoleService } from "../src/roles/role-service.js";

test("same tenant member can access owned resource", () => {
  const service = new TenantAccessService({ roleService: new RoleService() });
  const user = { id: "user-003", tenantId: "tenant-acme", role: "member" };
  assert.equal(service.canAccess(user, "document-001"), true);
});

test("acme member cannot access beta resource", () => {
  const service = new TenantAccessService({ roleService: new RoleService() });
  const user = { id: "user-003", tenantId: "tenant-acme", role: "member" };
  assert.equal(service.canAccess(user, "document-002"), false);
});

test("tenant admin can access resources inside their own tenant", () => {
  const service = new TenantAccessService({ roleService: new RoleService() });
  const user = { id: "user-002", tenantId: "tenant-acme", role: "admin" };
  assert.equal(service.canAccess(user, "document-001"), true);
});
