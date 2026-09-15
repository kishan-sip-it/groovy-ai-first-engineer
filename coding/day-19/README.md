<!-- READ THIS FIRST: this folder is deployment configuration only. Use ../../README.md for navigation and ../../RUNBOOK.md for the full execution map. -->

# Day 19 — CI/CD + Deploy Configuration

## Files

- [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) — GitHub Actions CI workflow.
- [`render.yaml`](./render.yaml) — Render deployment configuration.

## Local inspection

```bash
cd coding/day-19
cat render.yaml
cat .github/workflows/ci.yml
```

## Execution boundary

This folder does not contain a standalone local application server. Actual deployment requires a connected GitHub repository, configured Actions permissions/secrets, a Render service, and the required environment variables.

For the complete repository execution map, see [`../../RUNBOOK.md`](../../RUNBOOK.md).
