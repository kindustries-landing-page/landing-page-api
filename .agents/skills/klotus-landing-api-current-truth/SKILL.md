---
name: klotus-landing-api-current-truth
description: API-specific local-only skill for Klotus Landing Page API. Use when working in this repo to load the repo-local current-truth context and implementation rules without relying on external docs.
---

# Klotus Landing Page API Current-Truth

Use this skill only inside this repository (`./landing-page-api`).

## Local read order

1. `@.agents/AGENTS.md`
2. `@README.md`
3. Antigravity Brain (`implementation_plan.md` & `walkthrough.md`)

## Current truth

- Main branch = `master`, Remote = `github-industries`
- Framework = NestJS 11 + TypeScript 5
- Runtime & Package Manager = `bun` / `bunx`
- Scope: Public warranty funnel (`/api/v1/public-warranty`), Terminus health check (`/api/v1/health`), Swagger docs (`/api/docs`).

## Working rules

- Follow TDD: create `.spec.ts` for all controllers, services, and DTOs.
- Inspect current state before edits.
- Use Bun/Bunx first.
- Evidence-first approach.
- Follow Strict Git Workflow: `build -> check:ci -> test -> commit -> push`.
