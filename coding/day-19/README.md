<!-- READ THIS FIRST: this folder is deployment configuration only. Use ../../README.md for navigation and ../../RUNBOOK.md for the full execution map. -->

# Day 19 — CI/CD + Deploy Configuration

## Files

- [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) — GitHub Actions CI workflow.
- [`render.yaml`](./render.yaml) — Render deployment configuration.
- [`smoke-check.mjs`](./smoke-check.mjs) — release preflight validation.

## Extra engineering feature — Release preflight gate

`smoke-check.mjs` validates the repository structure and required package scripts before CI accepts the change. This catches broken paths/configuration before deployment.

## Local verification

```bash
cd coding/day-19
node smoke-check.mjs
```

Expected final line:

```text
Release preflight passed.
```

## CI

The workflow installs the Day 5 backend and AI lab dependencies and then runs the release preflight.

## Execution boundary

This folder does not contain a standalone local application server. Actual deployment requires a connected GitHub repository, configured Actions permissions/secrets, a Render service, and the required environment variables.

For the complete repository execution map, see [`../../RUNBOOK.md`](../../RUNBOOK.md).
