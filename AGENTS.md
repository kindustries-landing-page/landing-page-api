# Klotus Landing Page API — Agent Instructions

File này là entrypoint cho mọi AI agent/model làm việc trong repo `landing-page-api`.

## Required reading order

1. File này (`AGENTS.md`)
2. `README.md`
3. `.kiro/steering/project-context.md`

## Project identity

Đây là **public-facing API** cho landing page Klotus — KHÔNG phải ERP API.
- Không có auth guard (public endpoints)
- Không có user-scoped Directus client
- Dùng admin staticToken cho mọi Directus call
- Directus collections dùng prefix `klotus_` (không phải `gw_`)

## Tech stack

- NestJS 11 + TypeScript 5
- @directus/sdk (REST client, admin staticToken)
- @nestjs/terminus (health checks)
- class-validator + class-transformer (DTO validation)
- @nestjs/swagger (API docs tại `/api/docs`)
- Jest (unit testing)
- Plop (code generation)

## Project structure

```
src/
├── main.ts                    # Bootstrap: /api/v1 prefix, CORS, ValidationPipe, Swagger
├── app.module.ts              # Root module
├── app.controller.ts          # GET / (hello)
├── app.service.ts
├── directus/
│   ├── directus.module.ts     # @Global() — exports DIRECTUS_CLIENT
│   └── directus.provider.ts   # createDirectus + staticToken + rest
├── health/
│   ├── health.module.ts       # TerminusModule integration
│   ├── health.controller.ts   # GET /health
│   ├── directus.health.ts     # Custom HealthIndicator (ping Directus)
│   ├── health.controller.spec.ts
│   └── directus.health.spec.ts
└── public-warranty/
    ├── public-warranty.module.ts
    ├── public-warranty.controller.ts
    ├── public-warranty.service.ts
    ├── public-warranty.controller.spec.ts
    ├── public-warranty.service.spec.ts
    └── dto/
        ├── check-warranty.dto.ts
        ├── check-warranty.dto.spec.ts
        ├── activate-warranty.dto.ts
        └── activate-warranty.dto.spec.ts
```

## Commands

```bash
bun install                  # Install dependencies
bun run build                # Compile TypeScript
bun run start:dev            # Dev server (watch mode)
bun run check                # tsc + eslint + prettier (CI gate)
bun run test                 # Jest (all unit tests)
bun run generate             # Plop — scaffold new module/dto
```

## Code generation (Plop)

```bash
bun run generate
# Generators:
#   module — tạo full NestJS module (controller + service + module + spec files)
#   dto    — tạo DTO với class-validator decorators
```

Templates nằm trong `plop-templates/`.

## Testing rules (NON-NEGOTIABLE)

- Unit tests co-located: `*.spec.ts` cùng folder với source.
- Mỗi controller, service, DTO đều PHẢI có spec file.
- **If a test fails, fix the SOURCE CODE — NOT the test.**
- Run tests: `bun run test` (all) hoặc `bunx jest --testPathPattern=<pattern>` (specific).
- Test pattern:
  - Controller tests: mock service, verify delegation + params passing.
  - Service tests: mock Directus client (`{ request: jest.fn() }`), verify business logic.
  - DTO tests: dùng `class-validator` validate() trực tiếp.

## Module creation checklist

Khi tạo module mới:
1. Chạy `bun run generate` → chọn "module"
2. Register module trong `app.module.ts`
3. Viết DTOs với class-validator
4. Viết spec cho controller, service, DTOs
5. Verify: `bun run check && bun run test`

## API conventions

- Global prefix: `/api/v1/`
- Public endpoints: không cần auth
- ValidationPipe global: `whitelist: true, forbidNonWhitelisted: true, transform: true`
- Health endpoint: `GET /api/v1/health` (Terminus, check Directus connectivity)

## Directus integration

- Admin client injected globally via `DIRECTUS_CLIENT` token
- Collections prefix: `klotus_` (e.g. `klotus_vehicle_registry`, `klotus_warranty_activations`)
- Không dùng user-scoped client (API này public, không có user auth)

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default 3000) |
| `DIRECTUS_URL` | Yes | Directus instance URL |
| `DIRECTUS_ADMIN_TOKEN` | Yes | Admin static token |
| `WARRANTY_DURATION_MONTHS` | No | Warranty duration (default 36) |

## Mandatory execution contract

- Bun-first: mọi install/build/test/lint/format dùng `bun` / `bunx`.
- Không commit code mà test fail.
- Mỗi module mới phải có đầy đủ spec files.
