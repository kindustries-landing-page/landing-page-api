# Klotus Landing Page API Agent Entry

This file is the root entry point for AI agents in `landing-page-api`.

## Mandatory Implementation Authority

The canonical source of truth and full rules for this repository are defined in:
👉 [`.agents/AGENTS.md`](./.agents/AGENTS.md)

## Core Guardrails Summary

1. **Project Scope**: Public-facing Warranty API for Klotus landing page (no auth guards, interacts with ERP API via `/public-warranty`).
2. **Tooling**: Use `bun` / `bunx` exclusively (do NOT use `npm` or `yarn`).
3. **Auto-TDD & Testing**: Every controller, service, and DTO **MUST** have a corresponding `.spec.ts` unit test file.
4. **Git Operations**: All git commands MUST be run inside `./landing-page-api`. Remote is `github-industries`, branch is `master`.
5. **Strict Pre-push Mandate**: Before commit/push, you MUST run `bun run build`, `bun run check:ci`, and `bun run test`.
