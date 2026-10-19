import test from "node:test";
import assert from "node:assert/strict";
import { loadSecurityConfig } from "../src/security/env.js";
import { requireTenantAccess } from "../src/security/tenant-access.js";
import { validateToolRequest } from "../src/security/tool-policy.js";

test("rejects a missing provider API key", () => {
  assert.throws(() => loadSecurityConfig({ LLM_API_KEY: "" }), /Missing required configuration/);
});
test("rejects a short provider API key", () => {
  assert.throws(() => loadSecurityConfig({ LLM_API_KEY: "short" }), /minimum length/);
});
test("accepts a fake key and freezes config", () => {
  const config = loadSecurityConfig({ LLM_API_KEY: "fake-test-key-1234567890", NODE_ENV: "test" });
  assert.equal(config.nodeEnv, "test");
  assert.equal(config.llmApiKey, "fake-test-key-1234567890");
  assert.equal(Object.isFrozen(config), true);
});
test("rejects unauthenticated tenant access", () => {
  assert.throws(() => requireTenantAccess({ authenticatedUser: null, requestedTenantId: "tenant-a" }), e => e.statusCode === 401);
});
test("rejects tenant outside membership", () => {
  assert.throws(() => requireTenantAccess({
    authenticatedUser: { id: "user-1", tenantIds: ["tenant-a"] }, requestedTenantId: "tenant-b"
  }), e => e.statusCode === 403);
});
test("allows tenant in membership", () => {
  assert.equal(requireTenantAccess({
    authenticatedUser: { id: "user-1", tenantIds: ["tenant-a"] }, requestedTenantId: "tenant-a"
  }), "tenant-a");
});
test("rejects unapproved tool", () => {
  assert.throws(() => validateToolRequest({ name: "delete_all_documents", arguments: {} }), /Tool is not permitted/);
});
test("rejects invalid tool arguments", () => {
  assert.throws(() => validateToolRequest({ name: "search_own_documents", arguments: { query: "  " } }), /Invalid tool arguments/);
});
test("rejects too-long tool arguments", () => {
  assert.throws(() => validateToolRequest({ name: "search_own_documents", arguments: { query: "x".repeat(1001) } }), /Invalid tool arguments/);
});
test("accepts and normalizes an allowlisted tool", () => {
  assert.deepEqual(validateToolRequest({
    name: "search_own_documents", arguments: { query: " deployment guide " }
  }), { name: "search_own_documents", arguments: { query: "deployment guide" } });
});
