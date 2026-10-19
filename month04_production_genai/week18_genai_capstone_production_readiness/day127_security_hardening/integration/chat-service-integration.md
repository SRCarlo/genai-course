# Integrate into your existing chat service

Do not replace `src/application/chat.service.js` with a generic class. Merge timing helpers around existing retrieval and LLM calls so tenant checks, entitlement checks, retrieval behavior, and response shapes stay intact.

Add imports:
```js
import { performance } from "node:perf_hooks";
import { recordOperation, recordModelUsage } from "../observability/metrics.js";
```

Before the existing retriever call:
```js
const retrievalStartedAt = performance.now();
```

After successful retrieval (use your real variable names):
```js
recordOperation({
  requestId,
  operation: "retrieval",
  durationMs: performance.now() - retrievalStartedAt,
  success: true,
  tenantId,
});
```

Before the existing LLM adapter call:
```js
const modelStartedAt = performance.now();
```

After model response (replace `result` with your actual response variable and map its real token fields):
```js
recordModelUsage({
  requestId,
  provider: result.provider ?? "unknown",
  model: result.model ?? "unknown",
  durationMs: performance.now() - modelStartedAt,
  inputTokens: result.usage?.inputTokens ?? null,
  outputTokens: result.usage?.outputTokens ?? null,
  success: true,
});
```

At the start of the service method, store `const totalStartedAt = performance.now();`. Before returning success, call `recordOperation` with `operation: "chat_total"` and `durationMs: performance.now() - totalStartedAt`. In the existing catch path, record a failed total operation, then preserve the current error behavior. Never log raw prompts or private documents.
