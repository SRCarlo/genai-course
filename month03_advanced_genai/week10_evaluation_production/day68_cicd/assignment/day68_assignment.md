# DAY 68 ASSIGNMENT

## CI/CD FOR GENAI APPLICATIONS

## Mandatory

- [ ] Create GitHub Actions CI workflow
- [ ] Run npm ci
- [ ] Run unit tests
- [ ] Run integration tests
- [ ] Run security tests
- [ ] Run AI evaluation
- [ ] Fail CI when AI evaluation is below threshold
- [ ] Configure GitHub Secrets
- [ ] Test workflow with a Pull Request
- [ ] Document staging concept
- [ ] Document rollback strategy

## GenAI

- [ ] Define accuracy threshold
- [ ] Define faithfulness threshold
- [ ] Add AI evaluation gate
- [ ] Use small CI evaluation
- [ ] Plan larger staging evaluation
- [ ] Plan nightly evaluation
- [ ] Use Groq for real LLM evaluation
- [ ] Protect the Groq API key

## Advanced

- [ ] Add evaluation reports
- [ ] Add staging deployment
- [ ] Add production approval
- [ ] Add automated rollback
- [ ] Add separate environments
- [ ] Add CI caching

## Docker

Docker is intentionally skipped for Day 68.

## Final Pipeline

Git Push
↓
GitHub Actions
↓
npm ci
↓
npm test
↓
npm run test:security
↓
npm run evaluate
↓
PASS / FAIL

## Deployment Gate

Block deployment when:

- Unit tests fail
- Integration tests fail
- Critical security tests fail
- AI quality falls below threshold

## Completion

Day 68 is complete when the GitHub Actions workflow successfully runs all required checks.
