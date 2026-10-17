# Day 125 integration notes

These files add reliability calculations and a local latency collector. They do not replace your existing server, authentication, tenant authorization, usage limits, logging, or OpenTelemetry tracing.

## Add the test script

Merge this property into the existing `scripts` object in `package.json`; do not overwrite existing scripts:

```json
"test:reliability": "node --test tests/reliability.test.js"
```

Run from the project directory that contains the relevant `package.json` and `tests` folder:

```powershell
npm run test:reliability
```

The project must use ES modules (for example, `"type": "module"`).

## Optional local latency integration

Create one shared collector in the module responsible for local reliability reporting:

```js
import { createLatencyCollector } from './reliability/latency-sample.js';
export const latencyCollector = createLatencyCollector({ maxSamples: 10000 });
```

Wrap the actual operation you want to measure (replace `existingOperation()` with your real call):

```js
import { performance } from 'node:perf_hooks';

const startedAt = performance.now();
try {
  const result = await existingOperation();
  latencyCollector.record(performance.now() - startedAt);
  return result;
} catch (error) {
  latencyCollector.record(performance.now() - startedAt);
  throw error;
}
```

Keep API, retrieval, and model durations as separate measurements.

## Limitations

- Samples are in-memory and disappear on restart; this is not a production metrics backend or true rolling-window monitor.
- Define eligible requests and failure policy before reporting availability.
- Keep tenant IDs, prompts, retrieved text, API keys, authorization headers, and request IDs out of metric labels.
- Unit tests validate calculation logic, not actual production SLO compliance.

## CI workflow

Add this step using the real relative directory that contains the relevant `package.json`:

```yaml
- name: Test reliability calculations
  working-directory: path/to/day125-project
  run: npm run test:reliability
```

Replace the example path. If the files live in your existing capstone, use that capstone directory.
