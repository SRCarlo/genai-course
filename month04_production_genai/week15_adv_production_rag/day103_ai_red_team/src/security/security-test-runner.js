export async function runSecurityTests(tests, executor) {
  const results = [];

  for (const test of tests) {
    const startedAt = Date.now();

    try {
      const response = await executor(test.input ?? test.question ?? "");
      results.push({
        id: test.id,
        category: test.category,
        severity: test.severity,
        expected: test.expected,
        status: "EXECUTED",
        response,
        durationMs: Date.now() - startedAt
      });
    } catch (error) {
      results.push({
        id: test.id,
        category: test.category,
        severity: test.severity,
        expected: test.expected,
        status: "ERROR",
        error: error.message,
        durationMs: Date.now() - startedAt
      });
    }
  }

  return results;
}
