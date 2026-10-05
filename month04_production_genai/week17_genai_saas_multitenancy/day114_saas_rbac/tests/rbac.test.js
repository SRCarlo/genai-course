import test from "node:test";
import assert from "node:assert/strict";
import { RoleService } from "../src/roles/role-service.js";
import { PERMISSIONS } from "../src/permissions/permissions.js";

test("owner can manage users and billing", () => {
  const roles = new RoleService();
  assert.equal(roles.hasPermission("owner", PERMISSIONS.MANAGE_USERS), true);
  assert.equal(roles.hasPermission("owner", PERMISSIONS.MANAGE_BILLING), true);
});

test("admin can manage users but cannot manage billing", () => {
  const roles = new RoleService();
  assert.equal(roles.hasPermission("admin", PERMISSIONS.MANAGE_USERS), true);
  assert.equal(roles.hasPermission("admin", PERMISSIONS.MANAGE_BILLING), false);
});

test("member can use AI but cannot manage users", () => {
  const roles = new RoleService();
  assert.equal(roles.hasPermission("member", PERMISSIONS.USE_AI), true);
  assert.equal(roles.hasPermission("member", PERMISSIONS.MANAGE_USERS), false);
});

test("viewer cannot use AI", () => {
  const roles = new RoleService();
  assert.equal(roles.hasPermission("viewer", PERMISSIONS.USE_AI), false);
});
