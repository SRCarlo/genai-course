# Day 132 — GenAI Cost Governance

## Overview

This project implements a basic cost governance system for GenAI applications using Node.js.

It demonstrates token-based cost estimation, per-tenant budgets, budget reservations, settlement, and usage record creation.

## Features

- Estimate input and output token costs.
- Configure a spending budget for each tenant.
- Reserve estimated costs before processing requests.
- Reject reservations that exceed the available budget.
- Settle reservations using actual costs.
- Release reservations when requests fail.
- Prevent duplicate reservation IDs within the service instance.
- Create validated usage records with unique event IDs and timestamps.

## Project Structure

```text
day132_cost_governance/
├── src/
│   └── billing/
│       ├── cost-estimator.js
│       ├── quota-service.js
│       └── usage-record.js
├── tests/
│   └── cost-governance.test.js
├── notes.md
└── README.md
```

## Requirements

- Node.js 22 or later.
- No additional testing package is required.

## Run Tests

From this directory, run:

```bash
node --test
```

The current test suite contains 8 tests covering cost estimation, validation, budget enforcement, settlement, reservation release, duplicate reservation IDs, and usage records.

## Usage Flow

1. Estimate the request cost.
2. Check the tenant's configured budget.
3. Reserve the estimated amount.
4. Process the AI request.
5. Settle the reservation using the actual cost, or release it when appropriate.
6. Create a usage record for tracking.

## Important Limitations

This is a learning implementation, not a production-ready billing system.

- Budgets and reservations are stored in memory.
- Data is lost when the process restarts.
- Multiple server instances do not share or coordinate budgets.
- Settlement does not prevent actual cost from exceeding the original reservation.
- Usage records are not persisted to a database.
- Monthly quotas, invoice generation, refunds, and durable idempotency are not implemented.

## Production Improvements

A production implementation should use durable storage, atomic budget reservations, idempotent settlement, versioned pricing, explicit timeout and overage policies, tenant isolation, and budget alerts.

Never trust a budget supplied by the frontend. Enforce authorization and spending limits on the server.
