import test from "node:test";
import assert from "node:assert/strict";

import app from "../../src/app.js";

test("GET /health returns HTTP 200 and status ok", async () => {
  const server = app.listen(0);

  try {
    const address = server.address();

    const response = await fetch(`http://127.0.0.1:${address.port}/health`);

    assert.equal(response.status, 200);

    const body = await response.json();

    assert.equal(body.status, "ok");
  } finally {
    server.close();
  }
});
