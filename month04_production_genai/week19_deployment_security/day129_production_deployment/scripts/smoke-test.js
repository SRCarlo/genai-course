const baseUrl = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

async function check(path) {
  const response = await fetch(`${baseUrl}${path}`, {
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`${path} returned HTTP ${response.status}`);
  }

  const body = await response.json();
  console.log(`${path}: HTTP ${response.status}`, body.status);
}

async function main() {
  await check("/health/live");
  await check("/health/ready");
  console.log("Smoke tests passed");
}

main().catch((error) => {
  console.error("Smoke test failed:", error.message);
  process.exitCode = 1;
});
