# GenAI Deployment Security Checklist

## Container
- [ ] Runtime uses a non-root user.
- [ ] Image excludes secrets and unnecessary files.
- [ ] Production dependencies use the lockfile.
- [ ] Runtime image contains only required assets.
- [ ] Filesystem and Linux capabilities are restricted where practical.
- [ ] Resource limits and health checks are configured.
- [ ] Image scan results are reviewed.

## CI/CD
- [ ] Workflow permissions follow least privilege.
- [ ] Third-party actions are pinned to reviewed commit SHAs.
- [ ] Unit and security tests are required checks.
- [ ] Dependency and secret scanning are enabled.
- [ ] Deployment credentials are protected.
- [ ] Production deployment requires appropriate approval.
- [ ] SBOM and image provenance requirements are defined.

## GenAI application
- [ ] API keys use a managed secret store.
- [ ] Tenant authorization is enforced server-side.
- [ ] Prompts and model outputs are treated as untrusted.
- [ ] Logs avoid secrets and private documents.
- [ ] Rate limits and resource controls are configured.
- [ ] Rollback procedure is documented and tested.

## Release decision
- [ ] Required CI checks passed.
- [ ] High/critical findings are resolved or formally reviewed.
- [ ] Health checks pass after deployment.
- [ ] Monitoring and rollback ownership are clear.
- [ ] Release evidence is retained.
