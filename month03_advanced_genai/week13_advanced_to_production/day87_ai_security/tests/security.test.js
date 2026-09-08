import test from "node:test";
import assert from "node:assert/strict";
import {
  authorizeTool,
  canExecuteTool,
  getToolRisk
} from "../src/security/tool.guard.js";

test("user can search documents", () => {
  assert.equal(canExecuteTool("searchDocuments", "user"), true);
});

test("user cannot delete users", () => {
  assert.equal(canExecuteTool("deleteUser", "user"), false);
});

test("critical tools require human approval", () => {
  const result = authorizeTool({
    toolName: "deleteUser",
    userRole: "admin",
    riskLevel: getToolRisk("deleteUser")
  });

  assert.equal(result.allowed, false);
  assert.equal(result.approvalRequired, true);
});
