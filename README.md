# Klotus Landing Page API

NestJS API phục vụ landing page public cho flow tra cứu và kích hoạt bảo hành xe máy điện.

## Production target

- Host: `Head-Liouni`
- Domain: `api.klotus.vn`
- Directus: `db.klotus.vn`

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/` | Hello (smoke test) |
| GET | `/api/v1/health` | Health check (Terminus + Directus ping) |
| GET | `/api/v1/public/warranty/check` | Tra cứu bảo hành |
| POST | `/api/v1/public/warranty/activate` | Kích hoạt bảo hành |

## Health Check

`GET /api/v1/health` trả về:
- **200** — tất cả services healthy
- **503** — có service down (kèm chi tiết)

```json
{
  "status": "ok",
  "info": { "directus": { "status": "up" } },
  "details": { "directus": { "status": "up" } }
}
```

## Quick Start

```bash
bun install
cp .env.example .env
bun run start:dev
```

## Scripts

| Script | Description |
|--------|-------------|
| `bun run build` | Compile TypeScript |
| `bun run start:dev` | Dev server (watch) |
| `bun run start:prod` | Production server |
| `bun run check` | tsc + eslint + prettier (CI gate) |
| `bun run test` | Run all unit tests |
| `bun run generate` | Plop — scaffold module/dto |

## Code Generation

```bash
bun run generate
```

Generators:
- **module** — tạo full NestJS module (controller + service + module + spec files)
- **dto** — tạo DTO với class-validator decorators

## Project Structure

```
src/
├── main.ts                    # Bootstrap: prefix, CORS, ValidationPipe, Swagger
├── app.module.ts              # Root module
├── directus/                  # Global Directus client (admin token)
├── health/                    # Terminus health checks
└── public-warranty/           # Warranty check + activate
    └── dto/                   # Request DTOs
plop-templates/                # Plop generator templates
docs/                          # Documentation
.kiro/steering/                # AI agent steering files
```

## Required Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 3000 | Server port |
| `DIRECTUS_URL` | Yes | — | Directus instance URL |
| `DIRECTUS_ADMIN_TOKEN` | Yes | — | Admin static token |
| `WARRANTY_DURATION_MONTHS` | No | 36 | Warranty duration in months |

## Testing

```bash
bun run test              # All tests
bunx jest --testPathPattern=health   # Specific module
```

Test conventions:
- Co-located `*.spec.ts` files
- Controller: mock service, verify delegation
- Service: mock Directus client, verify business logic
- DTO: validate with class-validator directly

## Swagger

Available at `/api/docs` in development.

## Directus Collections

| Collection | Description |
|-----------|-------------|
| `klotus_vehicle_registry` | Danh sách xe |
| `klotus_warranty_activations` | Lịch sử kích hoạt bảo hành |
| `klotus_activation_logs` | Audit log mọi request |
