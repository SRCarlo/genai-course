# Day 128 — Deployment Security & Production Release Gates

## Goal
Harden GenAI application containers and CI/CD pipelines, protect secrets, and block unsafe releases.

## Core Concepts
- Non-root container: Reduces runtime privileges.
- Multi-stage build: Separates dependency installation from the runtime image.
- .dockerignore: Excludes unnecessary files from the Docker build context.
- npm ci: Installs dependencies using the lockfile.
- Least privilege: Gives CI/CD workflows only the permissions they need.
- Dependency scanning: Checks packages for known vulnerabilities.
- Image scanning: Checks container images for known vulnerabilities.
- Release gate: Blocks a release if required checks fail or are missing.
- Rollback: Restores a previous known-good version.

## GenAI-Specific Security
- Store provider API keys in a secure secrets manager.
- Enforce tenant authorization on server and data access.
- Treat prompts, retrieved content, tool arguments, and model output as untrusted.
- Avoid logging secrets or sensitive user data.
- Use rate limits, quotas, and monitoring.

## Files Created
- Dockerfile
- .dockerignore
- security/deployment-security-checklist.md
- src/release/release-gate.js
- tests/release-gate.test.js

## Test Command
node --test tests/release-gate.test.js

## Test Results
- Total tests: 3
- Passed: 3
- Failed: 0

## Important Note
The Dockerfile is a template. A Docker build requires the appropriate package.json, package-lock.json, and src/server.js files.

## Completion Evidence
Release gate tests passed. Docker build and dependency/image scanning must be verified separately before claiming they passed.
