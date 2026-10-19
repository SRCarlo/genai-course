# Day 127 Threat Model — GenAI SaaS Knowledge Assistant

## Scope
This working model covers the API, authentication middleware, tenant-scoped retrieval, provider credentials, model-generated tool requests, and logs/traces. It is not proof of production security.

| Asset | Threat / attacker capability | Impact | Preventive control | Detection | Recovery | Verification |
|---|---|---|---|---|---|---|
| Provider API key | Key exposed in Git, logs, CI, or runtime | Unauthorized provider use/cost | Protected secret store, ignored `.env`, least privilege, rotation | Secret scanning and usage review | Revoke/rotate, investigate usage | Missing/short key tests and repository scan |
| Tenant documents | Caller changes tenant ID or replays another tenant request | Private data disclosure | Verified identity, server-side membership check, tenant filter in storage | Audit denied access; cross-tenant tests | Contain access and investigate | Attempt cross-tenant reads through real API |
| Model tools | Prompt injection influences model output | Unauthorized reads/actions | Tool allowlist, strict schemas, independent authorization in handler | Log tool name/outcome without sensitive payload | Disable tool and add regression tests | Reject unknown tools and invalid arguments |
| Logs/traces | Prompts or errors include secrets/private content | Data leakage | Redaction, allowlisted fields, access control | Review telemetry and scan logs | Restrict access and rotate leaked credentials | Verify redaction |
| Usage/billing | Repeated requests or quota bypass | Cost spike or exhaustion | Server-side quotas, rate limits, timeouts, bounded retries | Usage alerts | Throttle/disable abusive access and review billing | Quota integration tests |

## Trust boundaries
1. User input and uploaded files are untrusted.
2. Authentication middleware validates the session/token and populates trusted `req.user`.
3. Tenant membership comes from trusted server-side data, not request JSON or headers.
4. Retrieved passages and model output remain untrusted.
5. Tool handlers validate arguments and independently authorize actions.
6. Secrets must not be returned to clients or written to logs.

## High-priority controls
- [ ] Authenticate every protected endpoint.
- [ ] Check tenant membership before retrieval and enforce it in storage.
- [ ] Keep provider keys out of Git, logs, frontend bundles, and responses.
- [ ] Treat retrieved documents as data, not authority.
- [ ] Validate tools and re-check authorization in handlers.
- [ ] Bound uploads, quotas, timeouts, and retries.
- [ ] Run security tests in CI.
- [ ] Rotate and investigate exposed credentials.

## Limitations
These helper unit tests do not prove the actual API, database, vector store, authentication provider, or deployment is secure. Add integration tests with separate identities and tenants against the real API and storage.
