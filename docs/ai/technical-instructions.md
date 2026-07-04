# Technical Instructions — Klotus Landing Page API

Status: Active
Scope: Áp dụng cho mọi AI agent/model làm việc trong repo này.

## 1) Source of truth và thứ tự đọc

1. `AGENTS.md` (entrypoint)
2. `README.md` (overview + endpoints)
3. `.kiro/steering/project-context.md` (architecture details)
4. File này (workflow rules)

## 2) Project identity

- **Repo**: `klotus/landing-page-api`
- **Purpose**: Public API cho landing page (warranty check/activate)
- **Framework**: NestJS 11 + TypeScript
- **Auth**: KHÔNG CÓ — tất cả endpoints public
- **Directus prefix**: `klotus_` (KHÔNG phải `gw_`)
- **Tooling**: Bun-first

## 3) Mandatory workflow

### 3.1 Bun-first tooling
Mọi install/build/test/lint/format dùng `bun` / `bunx`.
Chỉ fallback `npm`/`npx` nếu Bun không hỗ trợ (phải ghi rõ lý do).

### 3.2 Test coverage bắt buộc
- Mỗi controller → `*.controller.spec.ts`
- Mỗi service → `*.service.spec.ts`
- Mỗi DTO → `*.dto.spec.ts`
- **If a test fails, fix the SOURCE CODE — NOT the test.**

### 3.3 Code generation
Khi tạo module mới, dùng Plop:
```bash
bun run generate
```
Sau đó register module trong `app.module.ts`.

### 3.4 Verify trước khi báo hoàn tất
```bash
bun run check    # tsc + eslint + prettier
bun run test     # jest
```

## 4) Architecture rules

### 4.1 Module boundaries
- Mỗi domain là self-contained module (controller + service + DTOs + specs)
- Không trộn logic giữa các domain modules
- Shared code → tạo module riêng hoặc dùng `directus/` module

### 4.2 Directus integration
- Dùng admin staticToken (không có user-scoped client)
- Collections prefix: `klotus_`
- Mọi Directus call phải có error handling

### 4.3 DTO & Validation
- Mọi input phải qua DTO + class-validator
- ValidationPipe global: `whitelist: true, forbidNonWhitelisted: true, transform: true`
- Không bypass validation

### 4.4 Health checks
- Khi thêm external dependency mới, tạo custom HealthIndicator
- Register trong `src/health/health.module.ts`
- Thêm vào health controller check array

## 5) Testing patterns

### Controller test
Mock service, verify:
- Đúng method được gọi
- Đúng params được truyền
- Response được forward đúng

### Service test
Mock Directus client `{ request: jest.fn() }`, verify:
- Business logic đúng
- Error handling đúng
- Directus calls đúng thứ tự

### DTO test
Dùng `validate()` + `plainToInstance()`, verify:
- Valid data passes
- Missing required fields fail
- Invalid types fail
- MinLength/MaxLength constraints work

## 6) Validation gates (CI)

```bash
bun run check    # MUST pass: tsc + eslint + prettier
bun run test     # MUST pass: all specs green
bun run build    # MUST pass: nest build
```

## 7) Output contract khi báo hoàn tất

1. Files đã thay đổi/tạo mới
2. Test results (pass/fail count)
3. Build verification result
4. Nếu có issue → ghi lessons learned
