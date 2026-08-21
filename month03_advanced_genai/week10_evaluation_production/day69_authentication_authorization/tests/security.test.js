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

test("malformed JWT returns 401", async () => {
  const response = await request(app)
    .get("/api/users/profile")
    .set("Authorization", "Bearer definitely-not-a-jwt");

  assert.equal(response.status, 401);
});

test("missing bearer token returns 401", async () => {
  const response = await request(app)
    .get("/api/users/profile")
    .set("Authorization", "Token abc");

  assert.equal(response.status, 401);
});

test("AI endpoint requires authentication", async () => {
  const response = await request(app).post("/api/chat").send({
    message: "Hello",
  });

  assert.equal(response.status, 401);
});

test("AI endpoint validates input", async () => {
  const token = await login("user1@example.com", "User12345!");

  const response = await request(app)
    .post("/api/chat")
    .set("Authorization", `Bearer ${token}`)
    .send({});

  assert.equal(response.status, 400);
});

test("AI endpoint rejects oversized input", async () => {
  const token = await login("user1@example.com", "User12345!");

  const response = await request(app)
    .post("/api/chat")
    .set("Authorization", `Bearer ${token}`)
    .send({
      message: "x".repeat(5001),
    });

  assert.equal(response.status, 400);
});
