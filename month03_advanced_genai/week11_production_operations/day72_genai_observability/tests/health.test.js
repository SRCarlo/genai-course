import test from "node:test";

import assert from "node:assert/strict";

import request from "supertest";

import app from "../src/app.js";

test("GET /health returns ok", async () => {
  const response = await request(app).get("/health");

  assert.equal(response.status, 200);

  assert.equal(response.body.status, "ok");

  assert.ok(response.headers["x-request-id"]);
});

test("GET /health/live returns alive", async () => {
  const response = await request(app).get("/health/live");

  assert.equal(response.status, 200);

  assert.equal(response.body.status, "alive");
});

test("GET /health/ready returns ready", async () => {
  const response = await request(app).get("/health/ready");

  assert.equal(response.status, 200);

  assert.equal(response.body.status, "ready");
});

test("request ID is propagated", async () => {
  const response = await request(app)
    .get("/health")
    .set("X-Request-ID", "req_test_123")
    .set("X-Correlation-ID", "corr_test_123");

  assert.equal(response.headers["x-request-id"], "req_test_123");

  assert.equal(response.headers["x-correlation-id"], "corr_test_123");
});
