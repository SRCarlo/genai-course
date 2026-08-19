import test from "node:test";

import assert from "node:assert/strict";

import app from "../src/app.js";

test("GET /health returns 200", async () => {
  const server = app.listen(0);

  try {
    const { port } = server.address();

    const response = await fetch(`http://127.0.0.1:${port}/health`);

    assert.equal(response.status, 200);

    const body = await response.json();

    assert.equal(body.status, "ok");

    assert.equal(body.service, "genai-api");
  } finally {
    server.close();
  }
});

test("GET /health/live returns alive", async () => {
  const server = app.listen(0);

  try {
    const { port } = server.address();

    const response = await fetch(`http://127.0.0.1:${port}/health/live`);

    assert.equal(response.status, 200);

    const body = await response.json();

    assert.equal(body.status, "alive");
  } finally {
    server.close();
  }
});

test("GET /health/ready returns ready", async () => {
  const server = app.listen(0);

  try {
    const { port } = server.address();

    const response = await fetch(`http://127.0.0.1:${port}/health/ready`);

    assert.equal(response.status, 200);

    const body = await response.json();

    assert.equal(body.status, "ready");
  } finally {
    server.close();
  }
});
