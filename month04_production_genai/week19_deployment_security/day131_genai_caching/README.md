# Day 131 — GenAI Caching

## Overview

This project demonstrates exact-match response caching for GenAI applications using Node.js.

## Features

- SHA-256 response cache keys
- Question whitespace normalization
- In-memory cache using JavaScript `Map`
- Configurable TTL
- Explicit cache invalidation
- Cache hit/miss statistics
- Tenant and authorization scope isolation
- Prompt and index version isolation

## Project Structure

```text
day131_genai_caching/
├── src/
│   └── cache/
│       ├── cache-key.js
│       └── memory-cache.js
├── tests/
│   └── cache.test.js
├── notes.md
└── README.md
```

## Run Tests

From this directory, execute:

```bash
node --test
```

The test suite currently contains seven tests.

## Cache Invalidation Strategy

Entries expire according to their TTL. Individual entries can also be deleted explicitly. Changes to the prompt version or index version produce different cache keys.

## Security Considerations

Authenticate and authorize requests before reading cached responses. Include tenant and authorization scope in cache keys, and cache only eligible responses.

## Limitations

The in-memory cache is local to one process. It does not provide persistence or automatic sharing between application instances. Redis can be explored as a future extension.
