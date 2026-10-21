const test = require("node:test");
const assert = require("node:assert/strict");

const { loadConfig } = require("../src/deployment/config");

test("uses safe defaults in development", () => {
  const config = loadConfig({});

  assert.equal(config.port, 3000);
  assert.equal(config.nodeEnv, "development");
  assert.equal(config.isProduction, false);
});

test("rejects an invalid port", () => {
  assert.throws(
    () => loadConfig({ PORT: "99999" }),
    /PORT must be an integer/
  );
});

test("requires an LLM key in production", () => {
  assert.throws(
    () => loadConfig({ NODE_ENV: "production" }),
    /LLM_API_KEY is required/
  );
});

test("accepts production configuration with a key", () => {
  const config = loadConfig({
    NODE_ENV: "production",
    LLM_API_KEY: "example-test-value",
  });

  assert.equal(config.isProduction, true);
});
