---
description: Klotus Landing API implementation planning workflow
---

# Klotus Landing API Plan & Task

Use this workflow for features, refactors, migrations, and bug fixes in the Klotus API.

## Phase 1: Discovery

- Confirm repository, branch `master`, and runtime `.env`.
- Read the API router, current-truth skill, README, and affected module.
- Identify public endpoint, DTO, validation, external ERP proxy, and data boundary.

## Phase 2: Technical Plan

Document request/response contracts, validation, error mapping, authentication boundary,
database impact, rollback strategy, and Web handoff requirements.

## Phase 3: Atomic Tasks

Break work into `X.Y.Z` tasks. Keep each task to one or two files and provide a scoped
verification command. API unit tests use co-located `*.spec.ts` files and Jest.

## Phase 4: Approval Gate

Record breaking changes and open questions. Do not modify application code or run test
commands until the plan is approved.

## Phase 5: Execution and QC

Execute one active task at a time, update the plan after each passing scoped test, then run:

```bash
bun run build
bun run check:ci
bun run test
```

Update the affected skill/current-truth documentation when an API contract or architecture changes.
