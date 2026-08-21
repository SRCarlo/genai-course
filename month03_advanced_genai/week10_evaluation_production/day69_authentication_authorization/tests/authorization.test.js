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

test("normal user cannot access admin endpoint", async () => {
  const token = await login("user1@example.com", "User12345!");

  const response = await request(app)
    .get("/api/admin/users")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(response.status, 403);
});

test("admin can access admin endpoint", async () => {
  const token = await login("admin@example.com", "Admin12345!");

  const response = await request(app)
    .get("/api/admin/users")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(response.status, 200);
});

test("normal user cannot reindex tenant", async () => {
  const token = await login("user1@example.com", "User12345!");

  const response = await request(app)
    .post("/api/admin/reindex")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(response.status, 403);
});
