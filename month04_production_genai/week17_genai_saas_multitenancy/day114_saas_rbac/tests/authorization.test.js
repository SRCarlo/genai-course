import test from "node:test";
import assert from "node:assert/strict";
import { PermissionService } from "../src/permissions/permission-service.js";
import { RoleService } from "../src/roles/role-service.js";
import { PERMISSIONS } from "../src/permissions/permissions.js";

test("permission service checks user capability rather than user id", () => {
  const service = new PermissionService({ roleService: new RoleService() });
  assert.equal(
    service.check({ id: "any", role: "admin" }, PERMISSIONS.MANAGE_USERS),
    true,
  );
  assert.equal(
    service.check({ id: "another", role: "member" }, PERMISSIONS.MANAGE_USERS),
    false,
  );
});

test("tool permission mapping is explicit", () => {
  const service = new PermissionService({ roleService: new RoleService() });
  assert.equal(
    service.toolPermission("create_invoice"),
    PERMISSIONS.CREATE_INVOICE,
  );
  assert.equal(service.toolPermission("unknown_tool"), null);
});
