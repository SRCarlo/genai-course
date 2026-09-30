import { summarizeLatencies } from "../src/metrics/latency.js";

export async function sendRequest() {
  const start = performance.now();

  try {
    const response = await fetch(
      "http://localhost:3000/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: "Explain AI scaling in one sentence."
        })
      }
    );

    await response.text();

    return {
      ok: response.ok,
      status: response.status,
      latency: performance.now() - start
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      latency: performance.now() - start,
      error: error.message
    };
  }
}

export async function runLoad({
  totalRequests,
  concurrency
}) {
  const started = performance.now();
  const results = [];

  for (
    let i = 0;
    i < totalRequests;
    i += concurrency
  ) {
    const batchSize = Math.min(
      concurrency,
      totalRequests - i
    );

    const batch = Array.from(
      { length: batchSize },
      () => sendRequest()
    );

    results.push(...(await Promise.all(batch)));
  }

  const durationSeconds =
    (performance.now() - started) / 1000;

  const latencies = results.map((r) => r.latency);
  const successful = results.filter((r) => r.ok).length;
  const failed = results.length - successful;

  return {
    requests: results.length,
    successful,
    failed,
    durationSeconds: Number(durationSeconds.toFixed(2)),
    rps: Number(
      (results.length / durationSeconds).toFixed(2)
    ),
    ...summarizeLatencies(latencies),
    statusCounts: results.reduce((acc, result) => {
      acc[result.status] =
        (acc[result.status] || 0) + 1;
      return acc;
    }, {})
  };
}
