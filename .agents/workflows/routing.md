---
description: Klotus Landing API scope routing
---

# Klotus Landing API Routing

## Scope

This workflow applies only to `klotus/landing-page-api`.

## Read Order

1. Workspace `.agents/AGENTS.md`
2. `klotus/.agents/AGENTS.md`
3. This repository's `.agents/AGENTS.md`
4. `SKILL.md` referenced by the repository router
5. The relevant workflow and `README.md`

## Boundaries

- Use the Klotus database and environment only.
- Keep the public warranty API contract isolated from ERP implementation details.
- Do not edit `erp/` or `erp/erp-*` as part of a Klotus API task.
- Use `bun`/`bunx`; do not use `npm` or `yarn`.

## Delivery Handoff

API contract changes must be documented for `landing-page-web` before the Web phase starts.
Run API verification from this repository root and use branch `master` with remote `github-industries`.
