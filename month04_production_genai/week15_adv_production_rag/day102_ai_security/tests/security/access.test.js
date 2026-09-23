import test from "node:test";
import assert from "node:assert/strict";
import { canAccessDocument } from "../../src/security/access-policy.js";

test("same tenant public document is allowed", () => {
  assert.equal(
    canAccessDocument({
      user: { id: "user-a1", tenantId: "tenant-a" },
      document: {
        documentId: "doc-1",
        tenantId: "tenant-a",
        visibility: "public",
        ownerId: "other",
      },
    }),
    true,
  );
});

test("cross tenant document is denied", () => {
  assert.equal(
    canAccessDocument({
      user: { id: "user-a1", tenantId: "tenant-a" },
      document: {
        documentId: "doc-b",
        tenantId: "tenant-b",
        visibility: "public",
        ownerId: "user-b1",
      },
    }),
    false,
  );
});

test("private document is allowed only to owner", () => {
  assert.equal(
    canAccessDocument({
      user: { id: "user-a1", tenantId: "tenant-a" },
      document: {
        documentId: "private-a",
        tenantId: "tenant-a",
        visibility: "private",
        ownerId: "user-a1",
      },
    }),
    true,
  );

  assert.equal(
    canAccessDocument({
      user: { id: "user-a2", tenantId: "tenant-a" },
      document: {
        documentId: "private-a",
        tenantId: "tenant-a",
        visibility: "private",
        ownerId: "user-a1",
      },
    }),
    false,
  );
});

test("missing security context fails closed", () => {
  assert.equal(
    canAccessDocument({
      user: null,
      document: null,
    }),
    false,
  );
});
