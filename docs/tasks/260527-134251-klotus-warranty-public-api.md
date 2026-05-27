# Task: Klotus landing-page API warranty public endpoints

## Request Input (bạn chỉ cần điền phần này)
- Type: FEATURE
- Mục tiêu: Dựng NestJS API public cho landing page Klotus, hỗ trợ `check` và `activate` bảo hành dựa trên `sokhung` + `somay`, đọc/ghi Directus Klotus mới.
- Bối cảnh/ngữ cảnh: phase 1 chỉ làm DB + API cho landing page; dashboard để sau. Directus DB mới hoàn toàn, migrate/copy tối thiểu phần bảo hành.

## Goal
Tạo backend public an toàn cho landing page warranty, có lưu `activated_at`, tách rõ contract staging/prod theo env `DIRECTUS_URL`.

## Scope
- In-scope:
  - bootstrap repo NestJS trong `landing-page-api`
  - module/controller/service cho `GET /api/v1/public/warranty/check`
  - module/controller/service cho `POST /api/v1/public/warranty/activate`
  - DTO validation
  - Directus SDK integration
  - build + smoke basic
- Out-of-scope:
  - auth dashboard
  - UI landing-page-web
  - deploy CI/CD

## Relevant Files
- `src/main.ts` - bootstrap app + global prefix/pipes
- `src/app.module.ts` - module root
- `src/directus/**` - directus provider
- `src/public-warranty/**` - public warranty module/controller/service/dto

## Gate 0 — DB Precheck (bắt buộc)
- Collections/fields liên quan:
  - `klotus_vehicle_registry(frame_no, engine_no, vin, warranty_status, model_code, model_name)`
  - `klotus_warranty_activations(vehicle_id, warranty_code, activated_date, activated_at, warranty_start_date, warranty_end_date, status, activation_channel)`
  - `klotus_activation_logs(frame_no_input, engine_no_input, request_payload, result, error_message, ip_address, user_agent)`
- Data nền cần có:
  - vehicle registry tối thiểu có xe với cặp `frame_no + engine_no`
- Constraint/index/default cần có:
  - unique lookup theo `frame_no` và `engine_no`
  - `activated_at` not null default now
  - partial unique active warranty per vehicle
- Kết quả: `DB_READY`
- Nếu `DB_GAP_FOUND`: link DB task (directus-staging): `/opt/repos/klotus/directus-db-staging/ops-task-260527-134251-klotus-warranty-db.md`

## Coordination Impact
- [x] Directus staging schema affected
- [ ] ERP Web contract affected
- [x] No cross-system impact

## Checklist (cập nhật realtime)
- [x] 1.0 Gate 0 DB Precheck done
- [x] 2.0 Backend workflow/API gate done
- [x] 3.0 UI handoff gate done
- [ ] 4.0 Validate
  - [ ] 4.1 `bun run build`
  - [ ] 4.2 Smoke test affected endpoints
- [ ] 5.0 Close
  - [ ] 5.1 Lessons learned entry (if issue)
  - [ ] 5.2 Commit + push code (web/api)
  - [ ] 5.3 Summary with evidence

## Validation Evidence
- DB precheck result: `DB_READY` theo DB task artifact bootstrap mới
- Build: pending
- Smoke: pending

## Lessons Learned
- Link: No issue

## Commit/Push Status
- API repo: pending
- Web repo (if affected): N/A
- DB/directus staging: apply+verify+document (no code push required)

## UI handoff note
- Landing page chỉ cần gọi 2 endpoint public:
  - `GET /api/v1/public/warranty/check?sokhung=...&somay=...`
  - `POST /api/v1/public/warranty/activate`
- Query params nên map: `sokhung -> frame_no`, `somay -> engine_no`.
- Response không lộ dư thông tin nội bộ; chỉ trả các field an toàn cho end user.
