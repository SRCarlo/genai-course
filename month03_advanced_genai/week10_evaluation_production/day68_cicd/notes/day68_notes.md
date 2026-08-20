# DAY 68 — CI/CD FOR GENAI

## Goal

Automatically verify the GenAI application whenever code is pushed.

## CI

Continuous Integration automatically checks code changes.

Pipeline:

Git Push
↓
GitHub Actions
↓
npm ci
↓
Unit Tests
↓
Integration Tests
↓
Security Tests
↓
AI Evaluation
↓
PASS / FAIL

## GenAI CI

GenAI applications require more than normal unit tests.

Important checks:

- Unit tests
- Integration tests
- Security tests
- RAG tests
- Prompt regression tests
- AI evaluation

## AI Evaluation

Minimum thresholds:

Accuracy >= 0.90

Faithfulness >= 0.90

If AI quality falls below the threshold:

AI Evaluation
↓
FAIL
↓
CI FAIL
↓
Deployment blocked

## Cost Control

Small dataset:

Pull Request / CI

Medium dataset:

Staging

Large dataset:

Nightly evaluation

## Groq

This project uses Groq instead of OpenAI.

Environment variables:

GROQ_API_KEY
GROQ_MODEL
USE_GROQ_EVALUATION

Never commit API keys.

## Security

Security tests run automatically.

Example:

npm run test:security

A critical security failure should block deployment.

## GitHub Actions

Main workflow:

.github/workflows/ci.yml

Nightly workflow:

.github/workflows/nightly-evaluation.yml

## Secrets

Secrets belong in GitHub Secrets.

Example:

${{ secrets.GROQ_API_KEY }}

## Deployment Gate

The production candidate should pass:

Unit Tests

- Integration Tests
- Security Tests
- AI Evaluation

## Staging

Recommended flow:

Feature Branch
↓
Pull Request
↓
CI
↓
Merge
↓
Staging
↓
AI Validation
↓
Approval
↓
Production

## Rollback

Every release should be traceable to a source-code version.

If a release is bad:

Production
↓
Bad Release
↓
Previous Release
↓
Rollback

## Docker

Docker is intentionally skipped for Day 68.

## Main Lesson

Production GenAI requires:

Software Quality

- Security
- AI Quality
- Controlled Deployment
