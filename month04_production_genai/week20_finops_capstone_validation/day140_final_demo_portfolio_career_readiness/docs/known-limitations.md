# Known Limitations and Production Gaps

## Authentication

Demo authentication must be replaced with a real
identity provider or securely implemented authentication.

## Tenant Isolation

Tenant-scoped authorization and database queries must be
verified with integration tests.

## Retrieval

Mock retrieval must be replaced with persistent,
tenant-filtered vector retrieval.

## LLM

Mock LLM responses must be replaced with a real provider
adapter and verified error handling.

## Usage and Billing

In-memory usage and quota examples must be replaced with
durable, atomic, idempotent storage.

## Observability

Production telemetry must be connected to an actual
monitoring and alerting platform.

## Deployment

Deployment and release policy examples must be connected
to a real CI/CD environment.

## Final Status

Do not claim production readiness until the gaps above
are implemented and verified.
