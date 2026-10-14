# Day 122 — Updated files only

This ZIP intentionally contains only files that are new or updated for Day 122. It does not include the Day 121 `src/`, test files, or all inherited application files.

## Included

- `.github/workflows/genai-ci.yml` — new GitHub Actions workflow. It must be placed at the Git repository root under `.github/workflows/`.
- `day122_genai_ci_cd_pipeline/evals/run-evals.js` — updated evaluation runner with 90% quality gate and JSON report.
- `day122_genai_ci_cd_pipeline/notes-day122.md` — Day 122 notes.
- `day122_genai_ci_cd_pipeline/package-scripts.json` — script additions to merge into the real `package.json`.
- This README.

## Before running

1. Copy the Day 121 project to `day122_genai_ci_cd_pipeline`.
2. Merge the included files into that project/repository, preserving existing source files.
3. Merge the scripts in `package-scripts.json` into the existing `package.json` `scripts` object. Do not replace the whole `package.json`.
4. Ensure the copied project has `.nvmrc`, `package-lock.json`, `evals/evaluator.js`, `evals/evaluator.test.js`, `evals/datasets/chat-cases.json`, `evals/chat-adapter.js`, and the two test files referenced by the scripts.
5. If your repository path differs, update the workflow `working-directory`, `node-version-file`, `cache-dependency-path`, and artifact `path`.
6. CI runs deterministic fixtures and does not need `GROQ_API_KEY`. Optional live Groq mode is local: set `EVAL_USE_GROQ=true` and configure `.env` without committing it.

## Local commands

```powershell
npm ci
npm run test:eval
npm run test:integration
npm run test:security
npm run eval
```
