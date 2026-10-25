# Day 133 — GenAI Usage Analytics and FinOps

## Overview

This project implements a basic usage analytics and budget alert module for GenAI applications using Node.js.

It demonstrates usage aggregation, tenant-level cost reporting, model-level analytics, cache-hit rate calculation, and budget threshold evaluation.

## Features

- Aggregate input and output tokens.
- Calculate total and average provider cost.
- Calculate request success rate.
- Calculate cache-hit rate.
- Group usage by tenant and model.
- Filter analytics for a tenant.
- Reject duplicate event IDs.
- Generate budget warning and critical alerts.
- Validate usage events and budget inputs.

## Project Structure

```text
day133_usage_analytics/
├── src/
│   └── analytics/
│       ├── usage-analytics.js
│       └── budget-alerts.js
├── tests/
│   └── analytics.test.js
├── examples/
│   └── usage-events.json
├── notes.md
└── README.md
```

## Requirements

- Node.js 22 or later.
- Node.js built-in test runner.
- No additional testing package is required.

## Run Tests

From this directory, run:

```bash
node --test
```

The current test suite contains eight tests covering usage aggregation, cache-hit rate, tenant filtering, duplicate event IDs, and budget alerts.

## Example Budget Alert

For a tenant with a budget of `$100`:

- `$50` spent: no default alert.
- `$85` spent: warning at the 80% threshold.
- `$100` spent: warning and critical alerts.

These thresholds are example policies and can be configured.

## Important Limitations

- Analytics operate on the supplied in-memory dataset.
- The module does not connect to a database.
- Budget alerts are evaluated but not delivered through email or other notification services.
- Alerts are not deduplicated across repeated evaluations.
- The module does not automatically block requests when a budget is exceeded.
- Tenant filtering in this library is not a substitute for API authentication and authorization.

## Production Improvements

A production implementation should use a durable usage ledger, database-level aggregation, authenticated tenant scoping, provider-cost reconciliation, alert deduplication, reliable notification delivery, and monitoring for delayed or duplicated events.

Provider cost, customer-billable usage, and business revenue should be tracked as separate concepts.
