# Day 122 — GenAI CI/CD Pipeline & Automated Quality Gates

## Objective
Automate application tests and GenAI evaluation using GitHub Actions.

## Concepts
- CI validates code changes automatically.
- Quality gates prevent changes from passing when required checks fail.
- `npm ci` installs dependencies from the committed lockfile.
- GitHub Actions runs workflows on pushes and pull requests.
- Evaluation reports can be uploaded as artifacts.
- API keys must be stored securely.

## Workflow
1. Push code or open a pull request.
2. GitHub Actions checks out the repository.
3. Node.js is configured from `.nvmrc`.
4. Dependencies are installed using `npm ci`.
5. Application, evaluation, integration, and tenant-isolation tests run.
6. The evaluation quality gate checks the minimum pass rate.
7. The JSON report is uploaded as an artifact.

## Quality Gate
Minimum evaluation pass rate: 90%.

The pipeline fails if no cases are present or the pass rate is below 90%. Security tests remain independent of the AI evaluation score.

The evaluator uses a lexical-overlap heuristic. It is not a semantic proof of groundedness. The deterministic fixture run validates the evaluation mechanism, not live model quality.

## Security
- Never commit `.env` or API keys.
- Use GitHub Actions secrets only for workflows that require live credentials.
- Keep tenant-isolation tests independent of AI quality scores.
- Do not expose secrets to untrusted pull requests.

## Commands
```powershell
npm ci
npm test --if-present
npm run test:eval
npm run test:integration
npm run test:security
npm run eval
```

## Git Commit
`feat(day122): add genai CI quality gates`
