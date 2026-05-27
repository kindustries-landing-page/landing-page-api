# Klotus Landing Page API

NestJS API phục vụ landing page public cho flow kích hoạt bảo hành.

## Production target
- host: `Head-Liouni`
- domain: `api.klotus.vn`
- Directus domain: `db.klotus.vn`

## Phase 1 scope
- `GET /api/v1/public/warranty/check`
- `POST /api/v1/public/warranty/activate`
- Directus tables:
  - `klotus_vehicle_registry`
  - `klotus_warranty_activations`
  - `klotus_activation_logs`

## Required env
- `PORT`
- `DIRECTUS_URL`
- `DIRECTUS_ADMIN_TOKEN`
- `WARRANTY_DURATION_MONTHS` (default business duration, ví dụ 24)

## Run
```bash
bun install
cp .env.example .env
bun run build
bun run start:dev
```
