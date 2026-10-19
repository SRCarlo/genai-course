# Day 127 integration guide

This ZIP contains security helper modules, unit tests, notes, and a threat-model starter. It is not a replacement for the existing capstone.

## 1. Folder setup
Create `day127_security_hardening` beside `day126_production_alerting_incident_response`, copy Day 126 into Day 127 first, then merge these files into the copied project. Review before overwriting existing files.

## 2. `.gitignore` and `.env.example`
Ensure `.gitignore` contains:
```gitignore
.env
.env.*
!.env.example
```
Keep `.env.example` placeholder-only:
```dotenv
# Placeholder only; never paste real credentials here.
LLM_API_KEY=
```
Never stage a real `.env`. If a real key was committed, rotate/revoke it and investigate usage; a later deletion is not enough.

## 3. Add the package script
Merge into the existing `scripts` object in `package.json`:
```json
"test:security": "node --test tests/security.test.js"
```
Do not replace existing scripts. Then run `npm run test:security`. Expected: 10 passing helper unit tests.

## 4. Integrate carefully
- Call `loadSecurityConfig()` in server startup before creating the provider client. Never log or return its result.
- `requireTenantAccess()` expects a trusted user from verified auth middleware. Never construct that user from client request data.
- Enforce tenant filtering in the actual repository/storage layer as well.
- `validateToolRequest()` validates the tool name and query shape only; the actual handler must independently authorize user and tenant.
- Review any demo tenant header and do not treat it as production authentication.

## 5. CI integration
The root workflow is `genai-course/.github/workflows/genai-ci.yml`, which currently defaults to Day 122. Add a step with the Day 127 working directory:
```yaml
      - name: Run Day 127 security tests
        working-directory: month04_production_genai/week18_genai_capstone_production_readiness/day127_security_hardening
        run: npm ci && npm run test:security
```
Use this only if Day 127 contains its own `package.json` and `package-lock.json`. Preserve existing workflow steps and the Day 126 alerting step. Ensure the lockfile matches package.json.

## 6. Final checks
```powershell
npm run test:security
git status --short
git diff --check
```
Review staged files and ensure no `.env`, real key, or unrelated generated secret is included.
