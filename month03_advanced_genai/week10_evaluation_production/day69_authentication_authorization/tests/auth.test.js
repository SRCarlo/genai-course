import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import app from "../src/app.js";

test("protected profile requires authentication", async () => {
  const response = await request(app).get("/api/users/profile");

  assert.equal(response.status, 401);
});

test("valid user can login", async () => {
  const response = await request(app).post("/auth/login").send({
    email: "user1@example.com",
    password: "User12345!",
  });

  assert.equal(response.status, 200);

  assert.ok(response.body.accessToken);
  assert.ok(response.body.refreshToken);

  assert.equal(response.body.user.email, "user1@example.com");
});

test("invalid password returns 401", async () => {
  const response = await request(app).post("/auth/login").send({
    email: "user1@example.com",
    password: "wrong-password",
  });

  assert.equal(response.status, 401);
  assert.equal(response.body.error, "Invalid credentials");
});

test("valid JWT can access profile", async () => {
  const login = await request(app).post("/auth/login").send({
    email: "user1@example.com",
    password: "User12345!",
  });

  const response = await request(app)
    .get("/api/users/profile")
    .set("Authorization", `Bearer ${login.body.accessToken}`);

  assert.equal(response.status, 200);
  assert.equal(response.body.user.id, "user_1");
});
