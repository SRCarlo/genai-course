# DAY 127 — Production Security Hardening, Secrets Management & Threat Modeling for GenAI

## Today's Goal
Harden the GenAI SaaS capstone against secret exposure, broken tenant isolation, prompt injection, and unsafe tool execution.

## Key Concepts
- **Secrets management:** Protect credentials across development, CI/CD, and production.
- **Least privilege:** Give each identity only necessary permissions.
- **Tenant isolation:** Prevent one tenant from accessing another tenant's data.
- **Direct prompt injection:** Malicious instructions supplied by a user.
- **Indirect prompt injection:** Malicious instructions embedded in retrieved/uploaded content.
- **Tool allowlisting:** Restrict operations an LLM-driven system can invoke.
- **Defense in depth:** Use multiple independent safeguards.
- **Threat modeling:** Identify assets, trust boundaries, threats, impacts, and mitigations.

## Implementation Files
- `src/security/env.js`
- `src/security/tenant-access.js`
- `src/security/tool-policy.js`
- `tests/security.test.js`
- `.env.example`
- `security/threat-model.md`

## Security Rules
1. Never commit real API keys; rotate any key that may have been exposed.
2. Never trust a client-supplied tenant ID as proof of access.
3. Derive identity from verified authentication middleware.
4. Enforce tenant boundaries in application logic and persistent storage.
5. Treat retrieved documents and model output as untrusted.
6. Validate tool requests and independently authorize consequential actions.
7. Avoid logging secrets, private prompts, documents, or authorization headers.
8. Test unauthorized paths, not only successful requests.
9. Add security checks to CI and investigate dependency advisories.

## Test Command
`npm run test:security`

## Threat Model Priorities
Cross-tenant access, provider key exposure, prompt injection leading to unauthorized actions, quota/billing bypass, sensitive data in logs/traces.

## Interview Revision
**Why are environment variables not a complete secrets solution?** Secrets can still leak through process access, logs, CI output, or deployment misconfiguration.

**Why is prompt engineering not sufficient?** Model instructions are not authorization enforcement. Restrict access and validate actions outside the model.

**What is defense in depth?** Multiple independent safeguards reduce reliance on any single control.

## Completion Checklist
- [ ] Check Git ignore rules and `.env.example`.
- [ ] Validate required secrets at startup.
- [ ] Review tenant authorization.
- [ ] Implement security tests.
- [ ] Integrate tests into CI.
- [ ] Document the threat model.
- [ ] Review potential credential exposure.
- [ ] Commit reviewed changes.

## Next Day
Day 128 — GenAI Deployment Security, Docker Hardening, CI/CD Security & Production Release Gates.
