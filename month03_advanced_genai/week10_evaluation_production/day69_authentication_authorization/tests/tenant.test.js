import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import app from "../src/app.js";

async function login(email, password) {
  const response = await request(app).post("/auth/login").send({
    email,
    password,
  });

  return response.body.accessToken;
}

test("user can access own document", async () => {
  const token = await login("user1@example.com", "User12345!");

  const response = await request(app)
    .get("/api/documents/doc_a1")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(response.status, 200);
  assert.equal(response.body.document.id, "doc_a1");
});

test("user cannot access another user's document", async () => {
  const token = await login("user1@example.com", "User12345!");

  const response = await request(app)
    .get("/api/documents/doc_a2")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(response.status, 403);
});

test("tenant A cannot access tenant B document", async () => {
  const token = await login("user1@example.com", "User12345!");

  const response = await request(app)
    .get("/api/documents/doc_b1")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(response.status, 403);
});

test("user only receives documents from own tenant", async () => {
  const token = await login("user1@example.com", "User12345!");

  const response = await request(app)
    .get("/api/documents")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(response.status, 200);

  const documents = response.body.documents;

  for (const document of documents) {
    assert.equal(document.tenantId, "tenant_a");
  }
});
