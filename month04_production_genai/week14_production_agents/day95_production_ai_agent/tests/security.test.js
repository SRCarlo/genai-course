import test from "node:test";
import assert from "node:assert/strict";
import { canExecute } from "../src/security/permissions.js";
import { validateToolArguments } from "../src/security/validation.js";
import { executeTool } from "../src/agent/executor.js";

test("user can read orders", () => {
  assert.equal(canExecute("getOrder", "user"), true);
});

test("normal user cannot update customer", () => {
  assert.equal(canExecute("updateCustomer", "user"), false);
});

test("invalid order arguments are rejected", () => {
  assert.throws(
    () => validateToolArguments("getOrder", { orderId: "BAD-ID" }),
    /Invalid arguments/
  );
});

test("unknown tools are rejected", async () => {
  await assert.rejects(
    () =>
      executeTool({
        toolName: "deleteDatabase",
        args: {},
        role: "admin",
        customerId: "CUST-001"
      }),
    /Unknown tool/
  );
});

test("user cannot update another customer", async () => {
  await assert.rejects(
    () =>
      executeTool({
        toolName: "updateCustomer",
        args: {
          customerId: "CUST-002",
          email: "new@example.com"
        },
        role: "authenticated-user",
        customerId: "CUST-001"
      }),
    /own customer profile/
  );
});
