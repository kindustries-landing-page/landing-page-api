<!-- GENERATED FILE - DO NOT EDIT. Gộp từ: AGENTS.md (workspace root), klotus/AGENTS.md, klotus/landing-page-api/.agents/AGENTS.md. Sửa nguồn rồi chạy /sync-agents. -->
<!-- Đường dẫn tương đối ở phần workspace và family tính từ workspace root; từ repo này dùng ../../ để lên root. -->

---

<!-- Nguồn: AGENTS.md (workspace root) -->

# Multi-Family Workspace Router

**ROUTING & RULES ONLY:** This is the single source of truth for this multi-family workspace (Liouni ERP + Klotus). Application-specific implementation rules live in each family or repo router, not here.

This workspace contains two independent application families: Liouni ERP (multi-module backend) and Klotus (public warranty & landing page).

---

## 🧭 Family Routing

Mandatory reading order when working on a specific family:

- **ERP** (API or Web): load 👉 [`./erp/AGENTS.md`](./erp/AGENTS.md), then the repo router:
  - Backend API: [`./erp/erp-api/.agents/AGENTS.md`](./erp/erp-api/.agents/AGENTS.md) + [`./erp/erp-api/CLAUDE.md`](./erp/erp-api/CLAUDE.md)
  - Frontend Web: [`./erp/erp-web/.agents/AGENTS.md`](./erp/erp-web/.agents/AGENTS.md) + [`./erp/erp-web/CLAUDE.md`](./erp/erp-web/CLAUDE.md)
- **Klotus** (Landing Page API or Web): load 👉 [`./klotus/AGENTS.md`](./klotus/AGENTS.md), then:
  - Landing API: [`./klotus/landing-page-api/.agents/AGENTS.md`](./klotus/landing-page-api/.agents/AGENTS.md)
  - Landing Web: [`./klotus/landing-page-web/.agents/AGENTS.md`](./klotus/landing-page-web/.agents/AGENTS.md)

---

## 🛡️ Critical Guardrails (MUST FOLLOW)

### No Root Pushing
- **FORBIDDEN**: Running `git add`, `git commit`, or `git push` from workspace root or intermediate directories (`./erp`, `./klotus`).
- **REQUIRED**: `cd` into the concrete child repository before any git operation:
  - `./erp/erp-api` (API changes)
  - `./erp/erp-web` (frontend changes)
  - `./klotus/landing-page-api` (Klotus API)
  - `./klotus/landing-page-web` (Klotus web)

### Tool Standards
- **BUN ONLY**: Use `bun` / `bunx` exclusively. NEVER use `npm` or `yarn`.
- **No Manual Containers**: Do NOT build or start production deployment containers on the local machine.
- **Local Dev Only**: Use `bun run start:dev` / `bun run dev` for local testing.

### Branch & Deployment Strategy
- **ERP**: Work on `erp-master` FIRST, then sync downstream to `erp-greenway-*`, `erp-klotus-*`.
- **Klotus**: Work on `master` branch.
- **Delivery Sequence**: `Database (Phase 1)` → `API Backend (Phase 2)` → `Web Frontend (Phase 3)` → `QC (Phase 4)`.
- **Remote**: Always push to `github-industries`.

### Database & Environment
- **By Default**: Dùng `DATABASE_URL` trong `.env` (DB `erp_local` trên `db-dev.liouni.com:5433`) làm DB master. Tenant khác dùng file `.env.<tenant>-<stage>` tương ứng với nhánh deploy (`greenway-production`, `greenway-staging`, `klotus-production`, `klotus-staging`). Không có biến `ERP_MASTER_DATABASE_URL`; `.env` trần có thể đang trỏ DB production nên luôn kiểm tra `DATABASE_URL` trước khi chạy script, và script phải nhận file env tường minh.
- **Xác nhận DB**: trước khi quét hoặc ghi DB, chạy `SELECT current_database();` để biết DB thực tế, báo anh tên DB trước khi ghi; không suy ra DB từ tên file.
- **Context Isolation**: Do NOT mix databases, `.env`, or schema between ERP and Klotus.
- **Verify Runtime**: Read the actual `.env` before making changes (no outdated assumptions).

### Pre-Commit/Push Checklist
Before committing or pushing, run in order:
```bash
bun run build
bun run check:ci
bun run test  # or: bunx jest --forceExit (for API)
git commit
git push github-industries [target-branch]
```

---

## 📋 Workflow Catalog (single source of truth)

Each workflow is a slash command (e.g. `/plan-and-task`, `/erp-git-workflow`). Claude command stubs in `.claude/commands/` are generated from the canonical file; only edit the originals in `.agents/workflows/`. After changing anything in `.agents/`, run `/sync-agents`.

Global workflows in `./.agents/workflows/`:

- `sync-agents.md` — sync `.agents` sang `.claude` và `.trae` bằng `sync-agents.sh`.
- `routing.md` — workspace routing.
- `plan-and-task.md` — plan, approval, execution, and checkpoint workflow.
- `clean-brain.md` — session and plan cleanup.
- `erp-git-workflow.md` — ERP master-first Git workflow.
- `erp-web-v2-refactor.md` — ERP Web v2 migration workflow.
- `api-service-refactor.md` — ERP API service/controller refactoring.
- `standardize-table.md` — ERP table standardization.
- `ui-atomic-refactor.md` — UI atomic refactoring.

ERP workflows in `./erp/.agents/workflows/`:

- `erp-branch-sync-workflow.md` — sync `erp-master` to downstream branches.

Repo-level workflows (e.g. `erp/erp-web/.agents/workflows/standardize-drawer.md`) are listed in each repo's own router.

---

## 🚀 Quick Reference: Common Scenarios

### Scenario 1: Starting a New Feature / Refactor / Bugfix
1. Load `/plan-and-task` workflow.
2. Execute **5 phases**: Discovery → Tech Plan → Task Breakdown (X.Y.Z) → Approval → Execution.
3. Create `implementation_plan.md` with clear DoD and verification commands.
4. Use Antigravity Brain (`walkthrough.md` for execution tracking).
5. Update the task checklist in realtime as you progress.
6. When done: update the Module Skill (`erp/erp-api/.agents/skills/modules/<module>/SKILL.md` or `erp/erp-web/.agents/skills/modules/<module>/SKILL.md`).

### Scenario 2: Committing & Pushing Code (ERP)
1. Load `/erp-git-workflow` workflow.
2. Ensure you're on `erp-master`.
3. Run the pre-push checklist (build, check:ci, test), then `git commit` and `git push github-industries erp-master`.
4. If conflict: `git pull --rebase github-industries erp-master`.

### Scenario 3: Building a Data Table (ERP Web)
1. Load `/standardize-table` workflow.
2. Follow 4 steps: Table component, Header Filters, Server-side API call, STT 1-based, QC.
3. Use existing `SpreadsheetPageTemplate` and `DataTable` components.
4. Verify filter, sort, pagination work end-to-end.

### Scenario 4: Building a Form Drawer (ERP Web)
1. Load `/standardize-drawer` workflow.
2. Follow 4 steps: StandardFormDrawer, Responsive sizing (`vw`), Collapsible sections, Top tabs.
3. Ensure form fields use proper validation and translation keys.

### Scenario 5: Refactoring Large Service (ERP API)
1. Load `/api-service-refactor` workflow.
2. Scan file sizes: Controller >300 LoC, Service >500 LoC.
3. Choose a pattern: Sub-Controllers, Sub-Services Facade, Pure Engine.
4. Maintain 100% backward compatibility via the Facade pattern.
5. Use a clean DI constructor (NO overloading / union types).
6. Add unit tests co-located with each sub-service.

---

## 📚 Skills & Module Knowledge

- All skills are registered in [`./.agents/skills.json`](./.agents/skills.json) and organized by repo:
  - `erp/erp-api/.agents/skills/` — Backend skills (DB migrate, module scanning, deployment)
  - `erp/erp-web/.agents/skills/` — Frontend skills (UI pattern detection, components)
  - `klotus/landing-page-api/.agents/skills/` — Klotus API skills
  - `klotus/landing-page-web/.agents/skills/` — Klotus web skills
- Module knowledge: `erp/erp-api/.agents/skills/modules/<module-name>/SKILL.md` (backend) or `erp/erp-web/.agents/skills/modules/<module-name>/SKILL.md` (frontend).
- Before modifying any core module, read its SKILL.md first. After schema/API changes, update it with `scan-module-knowledge` or manually.

---

## 🧠 Brain & Planning

- Create `implementation_plan.md` for every feature/refactor/bugfix.
- Use `walkthrough.md` for real-time execution tracking.
- Save progress in `.agents/` ➔ Antigravity Brain (Claude Code internal storage).
- Use `/clean-brain` periodically to clean old sessions.
- **Pause**: document current state in `## ⏸️ Session Checkpoint`.
- **Resume**: read the checkpoint to identify exactly where you left off.

---

## 🔗 Canonical Routers

- **Workspace canonical router**: [`./.agents/AGENTS.md`](./.agents/AGENTS.md)
- **ERP Family**: [`./erp/AGENTS.md`](./erp/AGENTS.md)
- **Klotus Family**: [`./klotus/AGENTS.md`](./klotus/AGENTS.md)
- **Validate agent system**: `bash ./.agents/scripts/validate-agent-system.sh`

---

## ⚠️ Common Anti-Patterns (AVOID)

- ❌ Don't run git from workspace root or intermediate directories
- ❌ Don't mix ERP (`erp-master`) and Klotus (`master`) branches
- ❌ Don't use `npm` or `yarn` (use `bun`/`bunx` only)
- ❌ Don't hardcode strings in UI (use i18n translation keys)
- ❌ Don't start with code before creating an `implementation_plan.md`
- ❌ Don't leave ad-hoc `.ts` files at repo root (breaks `dist/` output structure)
- ❌ Don't reference outdated docs (always verify with actual code state)
- ❌ Don't mix database schemas, `.env`, or domain models between ERP and Klotus
- ❌ Don't commit code without running the pre-push checklist (build, check:ci, test)

---

## 🎯 Hierarchy

1. **Workspace** (`CLAUDE.md` → `AGENTS.md`) — guardrails, routing, workflow catalog
2. **Family** (`./erp/AGENTS.md`, `./klotus/AGENTS.md`) — family rules
3. **Repo** (`./erp/erp-api/CLAUDE.md`, etc.) — repo mandates
4. **Workflow** (`.agents/workflows/`) — executable procedures
5. **Module** (`erp/erp-*/.agents/skills/modules/*/SKILL.md`) — domain knowledge

**Always read in order** when starting work on a specific part of the codebase.

---

<!-- Nguồn: klotus/AGENTS.md -->

# Klotus Ecosystem Agent Entry

Entry point for AI agents working in the Klotus family (thư mục `klotus/` trong workspace root). Workspace-level rules and the global workflow catalog live in `../AGENTS.md`.

## Child Repositories

| Việc | Vào repo | Rule chi tiết |
|------|----------|---------------|
| Backend API | `./landing-page-api` (Remote `github-industries`, branch `master`) | [`./landing-page-api/.agents/AGENTS.md`](./landing-page-api/.agents/AGENTS.md) |
| Frontend Web | `./landing-page-web` (Remote `github-industries`, branch `master`) | [`./landing-page-web/.agents/AGENTS.md`](./landing-page-web/.agents/AGENTS.md) |

Skills và task artifacts nằm trong `./landing-page-api/.agents` và `./landing-page-web/.agents`, đăng ký ở `../.agents/skills.json`.

## Strict Guardrails

1. **NO ROOT PUSHING**: Cấm chạy `git add`, `git commit`, `git push` từ `./klotus` hoặc workspace root. Luôn `cd` vào `./landing-page-api` hoặc `./landing-page-web`.
2. **Klotus Scope**: Public Warranty & Landing page funnel. Mọi collection/entity phải dùng prefix `klotus_*` (không dùng `gw_*` hay `erp_*`).
3. **Ecosystem Isolation**: Klotus là family tách biệt với Liouni ERP. Funnel bảo hành công khai gọi ERP API qua contract `/public-warranty`. Không trộn database, `.env`, hay domain model với ERP.
4. **Branch**: Làm việc trên `master`. Remote là `github-industries` (fallback `origin` nếu thiếu).
5. **Tooling**: Chỉ dùng `bun` / `bunx`. Không dùng `npm` hay `yarn`.
6. **Local Testing Only**: Không build hay chạy container deploy thủ công. Dev local chạy `bun run start:dev` / `bun run dev`.

## Workflows

Workflow Klotus nằm ở `./.agents/workflows/`:

- `routing.md` — routing theo family và repo.
- `delivery-workflow.md` — bàn giao DB/API/Web/QC.
- `clean-brain.md` — bảo trì workspace.

Workflow global (`plan-and-task.md`, `erp-git-workflow.md`, ...) xem catalog ở `../AGENTS.md`.

---

<!-- Nguồn: klotus/landing-page-api/.agents/AGENTS.md -->

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
- Before running `git push`, you **MUST** run `bun run build`, `bun run check:ci`, and `bun run test`.
- Do NOT push if any of these commands fail.

### 5. Rebase First Conflict Resolution
- When pulling or pushing code, your **first priority** is to use `git pull --rebase github-industries master`.
- Only if the rebase presents overly complex conflicts, you may `git rebase --abort` and resolve using a standard merge.

---

## Current Truth

- Main branch: **`master`**
- Remote: **`github-industries`**
- Repo role:
  - Public-facing API for Klotus warranty check/activation
  - Proxy/Integrator with Liouni ERP API
  - Health check & Swagger API docs (`/api/docs`)

---

## Git Workflow Mandates

When asked to **commit code**, you MUST execute the following in order:
1. `bun run build`
2. `bun run check:ci`
3. `bun run test`
4. `git commit -m "<type>(<scope>): <message>"`

When asked to **pull code**, you MUST execute the following in order:
1. If there are uncommitted changes, save/commit them first.
2. `git pull --rebase github-industries master` (and resolve conflicts if any)

When asked to **push code**, you MUST execute the following in order:
1. If there are uncommitted changes, save/commit them first.
2. `git pull --rebase github-industries master` (and resolve conflicts if any)
3. `bun run build`
4. `bun run check:ci`
5. `bun run test`
6. `git push github-industries master`

**Git Execution Context**: You MUST perform all Git operations exclusively inside the `landing-page-api` directory. NEVER run git commands from the workspace root.
