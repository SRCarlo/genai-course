import test from "node:test";

import assert from "node:assert/strict";

import app from "../src/app.js";

test("GET / returns API information", async () => {
  const server = app.listen(0);

  try {
    const { port } = server.address();

    const response = await fetch(`http://127.0.0.1:${port}/`);

    assert.equal(response.status, 200);

    const body = await response.json();

    assert.equal(body.service, "GenAI API");

    assert.equal(body.status, "running");

    assert.ok(body.requestId);
  } finally {
    server.close();
  }
});

test("POST /api/chat rejects empty message", async () => {
  const server = app.listen(0);

  try {
    const { port } = server.address();

    const response = await fetch(`http://127.0.0.1:${port}/api/chat`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        message: "",
      }),
    });

    assert.equal(response.status, 400);

    const body = await response.json();

    assert.equal(body.error, "message must be a non-empty string");
  } finally {
    server.close();
  }
});

test("POST /api/chat rejects oversized message", async () => {
  const server = app.listen(0);

  try {
    const { port } = server.address();

    const hugeMessage = "A".repeat(5001);

    const response = await fetch(`http://127.0.0.1:${port}/api/chat`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        message: hugeMessage,
      }),
    });

    assert.equal(response.status, 400);

    const body = await response.json();

    assert.equal(body.error, "message must not exceed 5000 characters");
  } finally {
    server.close();
  }
});

test("unknown route returns 404", async () => {
  const server = app.listen(0);

  try {
    const { port } = server.address();

    const response = await fetch(`http://127.0.0.1:${port}/unknown`);

    assert.equal(response.status, 404);

    const body = await response.json();

    assert.equal(body.error, "Route not found");
  } finally {
    server.close();
  }
});
