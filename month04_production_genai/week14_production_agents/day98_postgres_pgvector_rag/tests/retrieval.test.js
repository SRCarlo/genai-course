import test from "node:test";
import assert from "node:assert/strict";
import { Retriever } from "../src/ai/rag/retriever.js";

test("retriever passes tenantId to vector repository", async () => {
  let received;

  const repository = {
    async search(args) {
      received = args;
      return [];
    }
  };

  const retriever = new Retriever(repository, {
    topK: 5,
    maxDistance: 0.75
  });

  await retriever.retrieve({
    queryVector: [0.1, 0.2],
    tenantId: "tenant-a"
  });

  assert.equal(received.tenantId, "tenant-a");
  assert.equal(received.topK, 5);
  assert.equal(received.maxDistance, 0.75);
});
