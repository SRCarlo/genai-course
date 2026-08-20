import test from "node:test";
import assert from "node:assert/strict";

import app from "../../src/app.js";

test("unknown API route returns 404", async () => {
  const server = app.listen(0);

  try {
    const address = server.address();

    const response = await fetch(
      `http://127.0.0.1:${address.port}/does-not-exist`,
    );

    assert.equal(response.status, 404);
  } finally {
    server.close();
  }
});

test("health endpoint does not expose secrets", async () => {
  const server = app.listen(0);

  try {
    const address = server.address();

    const response = await fetch(`http://127.0.0.1:${address.port}/health`);

    const body = await response.text();

    assert.equal(body.includes("GROQ_API_KEY"), false);

    assert.equal(body.includes("sk-"), false);
  } finally {
    server.close();
  }
});

test("application does not expose environment variables", async () => {
  const server = app.listen(0);

  try {
    const address = server.address();

    const response = await fetch(`http://127.0.0.1:${address.port}/`);

    const body = await response.text();

    assert.equal(body.includes("process.env"), false);

    assert.equal(body.includes("GROQ_API_KEY"), false);
  } finally {
    server.close();
  }
});
