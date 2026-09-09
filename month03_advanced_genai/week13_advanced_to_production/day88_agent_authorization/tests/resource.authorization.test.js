import test from "node:test";
import assert from "node:assert/strict";
import { canReadOrder, canAccessResource } from "../src/security/resource.authorization.js";

const order = { id: "ORD-1", userId: "user-123" };

test("owner can read own order", () => {
  assert.equal(canReadOrder({ userId: "user-123", order }), true);
});

test("customer cannot read another user's order", () => {
  assert.equal(canReadOrder({ userId: "user-999", order }), false);
});

test("admin can access resource", () => {
  assert.equal(canAccessResource({
    user: { id: "admin-1", role: "admin" },
    resource: order
  }), true);
});

test("non-owner cannot access resource", () => {
  assert.equal(canAccessResource({
    user: { id: "user-999", role: "customer" },
    resource: order
  }), false);
});
