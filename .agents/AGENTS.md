# Klotus Landing Page API Agent Bootstrap

Source of truth for this repository (`./landing-page-api`).

## Read order

1. `.agents/skills/klotus-landing-api-current-truth/SKILL.md`
2. `README.md`
3. Antigravity Brain (`implementation_plan.md` & `walkthrough.md`)

---

## API Specific Agent Mandates

### 1. API Auto-TDD (Test Driven Development)
- After creating or modifying a core function, service, controller, or critical logic, you **MUST** generate/update the corresponding `.spec.ts` file.
- Unit tests must be co-located (`*.spec.ts` in the same directory as source).
- Controller tests: mock service, verify delegation and params passing.
- Service tests: mock ERP API client or external dependencies, verify business logic.
- DTO tests: use `class-validator` `validate()` directly.
- **If a test fails, fix the SOURCE CODE — NOT the test.**

### 2. Code Generation (Plop)
- When adding new modules or DTOs, use Plop scaffolding:
  ```bash
  bun run generate
  ```
- Templates are located in `plop-templates/`.

### 3. API Conventions & Guardrails
- Global prefix: `/api/v1/`
- ValidationPipe global: `whitelist: true, forbidNonWhitelisted: true, transform: true`
- Health endpoint: `GET /api/v1/health` (Terminus)
- Public endpoints: no auth guards required for public warranty endpoints.

### 4. Strict Pre-push Hook
- Commit: pre-commit tự chạy lint-staged (eslint, prettier, `jest --findRelatedTests` trên file staged).
- Push: pre-push chạy `bun run type:check`. Do NOT push if it fails.
- Full build / check:ci / test chạy trên GitHub CI.

### 5. Rebase First Conflict Resolution
- When pulling or pushing code, your **first priority** is to use `git pull --rebase github-industries master`.
- Only if the rebase presents overly complex conflicts, you may `git rebase --abort` and resolve using a standard merge.

---

## Current Truth

- Main branch: **`master`**
- Remote: **`github-industries`**
- Repo role:
  - Public-facing API for Klotus warranty check/activation
  - Proxy/Integrator with ERP API
  - Health check & Swagger API docs (`/api/docs`)

---

## Git Workflow Mandates

When asked to **commit code**, you MUST execute the following in order:
1. `git commit -m "<type>(<scope>): <message>"` (pre-commit tự chạy lint-staged và `jest --findRelatedTests` trên file staged)

When asked to **pull code**, you MUST execute the following in order:
1. If there are uncommitted changes, save/commit them first.
2. `git pull --rebase github-industries master` (and resolve conflicts if any)

When asked to **push code**, you MUST execute the following in order:
1. If there are uncommitted changes, save/commit them first.
2. `git pull --rebase github-industries master` (and resolve conflicts if any)
3. `git push github-industries master` (pre-push chạy `bun run type:check`; build/check:ci/test chạy trên GitHub CI)

**Git Execution Context**: You MUST perform all Git operations exclusively inside the `landing-page-api` directory. NEVER run git commands from the workspace root.
