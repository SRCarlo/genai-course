import test from "node:test";
import assert from "node:assert/strict";
import { hasPermission, hasEffectivePermission } from "../src/security/authorization.js";

test("customer can read orders", () => {
  assert.equal(hasPermission("customer", "order:read"), true);
});

test("support cannot refund", () => {
  assert.equal(hasPermission("support", "order:refund"), false);
});

test("manager can refund", () => {
  assert.equal(hasPermission("manager", "order:refund"), true);
});

test("unknown role is denied", () => {
  assert.equal(hasPermission("unknown", "order:read"), false);
});

test("admin has delete permission", () => {
  assert.equal(hasPermission("admin", "customer:delete"), true);
});

test("effective permission requires both user and agent", () => {
  assert.equal(hasEffectivePermission({
    userPermissions: ["order:refund"],
    agentPermissions: ["order:read"],
    requiredPermission: "order:refund"
  }), false);
});
