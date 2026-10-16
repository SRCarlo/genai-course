# Day 124 — OpenTelemetry integration

## Folder name

`day124_opentelemetry_distributed_tracing`

Copy Day 123 into this folder, then overlay the Day 124 files. This bundle contains Day 124 files and notes, not your entire app.

## Install

```powershell
npm install @opentelemetry/api @opentelemetry/sdk-node @opentelemetry/sdk-trace-node @opentelemetry/auto-instrumentations-node
```

## Update package.json scripts

Keep every existing script. Change only `dev` and `start` so instrumentation loads before the app:

```json
"dev": "node --watch --import ./src/observability/instrumentation.js src/server.js",
"start": "node --import ./src/observability/instrumentation.js src/server.js"
```

Add this script if desired:

```json
"test:observability:tracing": "node --test tests/observability-tracing.test.js"
```

Merge these into the existing `scripts` object; do not create a second `scripts` object.

## Integrate into src/application/chat.service.js

Add:

```js
import { traceRetrieval, traceGeneration } from '../observability/chat-tracing.js';
```

Wrap the existing retrieval call while keeping all current validation, authorization, tenant scoping, metrics, and error handling:

```js
sources = await traceRetrieval(
  () => this.retriever.search({ tenantId, query: question.trim(), limit: 5 }),
  requestId ? { 'app.request_id': requestId } : {},
);
```

Wrap the existing LLM call while keeping all existing output validation, usage accounting, metrics, and error handling:

```js
result = await traceGeneration(
  () => this.llm.generate({ question: question.trim(), context }),
  requestId ? { 'app.request_id': requestId } : {},
);
```

Adapt variable names and formatting to your actual service. Keep existing `recordOperation` / `recordModelUsage` calls. Never attach prompts, responses, document content, API keys, or raw headers to spans.

## Validate

```powershell
npm run check
npm run test:observability
npm run test:observability:tracing
npm test
npm run test:eval
```

Then run `npm run dev`, call an API route that uses chat, and inspect the console-exported spans. Stop with Ctrl+C.

## Commit

```powershell
git add .
git commit -m "feat(day124): add OpenTelemetry distributed tracing"
git push origin master
```
