"use strict";

const baseUrl = process.env.BASE_URL;
const expectedVersion = process.env.EXPECTED_VERSION;

if (!baseUrl) {
  console.error("Missing BASE_URL environment variable.");
  process.exit(1);
}

let parsedBaseUrl;

try {
  parsedBaseUrl = new URL(baseUrl);
} catch {
  console.error("BASE_URL must be a valid URL.");
  process.exit(1);
}

if (!["http:", "https:"].includes(parsedBaseUrl.protocol)) {
  console.error("BASE_URL must use HTTP or HTTPS.");
  process.exit(1);
}

if (parsedBaseUrl.username || parsedBaseUrl.password) {
  console.error("Do not include credentials in BASE_URL.");
  process.exit(1);
}

if (
  process.env.NODE_ENV === "production" &&
  parsedBaseUrl.protocol !== "https:"
) {
  console.error("Production smoke tests require HTTPS.");
  process.exit(1);
}

const checks = [
  { name: "liveness", path: "/health/live" },
  { name: "readiness", path: "/health/ready" },
];

if (expectedVersion) {
  checks.push({ name: "version", path: "/version" });
}

async function checkEndpoint(check) {
  const url = new URL(check.path, parsedBaseUrl);

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000),
      redirect: "error",
      headers: { accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    if (check.name === "version") {
      const body = await response.json();

      if (body.version !== expectedVersion) {
        throw new Error(
          `Expected version ${expectedVersion}, received ${body.version}`
        );
      }
    }

    console.log(`PASS ${check.name}`);
    return true;
  } catch (error) {
    console.error(`FAIL ${check.name}: ${error.message}`);
    return false;
  }
}

async function main() {
  const results = await Promise.all(checks.map(checkEndpoint));
  const passed = results.filter(Boolean).length;
  const failed = results.length - passed;

  console.log(
    `\nSmoke test results: ${passed} passed, ${failed} failed`
  );

  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Smoke test runner failed:", error.message);
  process.exitCode = 1;
});
