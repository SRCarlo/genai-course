import test from "node:test";
import assert from "node:assert/strict";
import { logger } from "../src/infrastructure/observability/logger.js";
test("logger should expose info, warn and error methods", () => {
  assert.equal(typeof logger.info, "function");
  assert.equal(typeof logger.warn, "function");
  assert.equal(typeof logger.error, "function");
});
