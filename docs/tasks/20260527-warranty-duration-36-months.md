## Request Input (bạn chỉ cần điền phần này)
- Type: ENHANCE
- Mục tiêu: Đổi thời hạn bảo hành mặc định ở API từ 24 tháng thành 36 tháng.
- Bối cảnh/ngữ cảnh: User chốt scope A, chỉ tính lại API thôi, không đổi DB/UI trong task này.

## Goal
Cập nhật logic API để warranty end date mặc định tính theo 36 tháng thay vì 24 tháng.

## Scope
- In-scope:
  - `landing-page-api` logic tính `warranty_end_date`
  - test/backend build
  - deploy API production + smoke test API
- Out-of-scope:
  - cập nhật dữ liệu activation cũ trong DB
  - thay đổi UI text
  - thay đổi Directus schema

## Relevant Files
- `src/public-warranty/public-warranty.service.ts` - logic đọc duration và tính ngày hết hạn
- `src/public-warranty/public-warranty.service.spec.ts` - test regression duration
- `README.md` - env note mặc định business duration nếu cần

## Gate 0 — DB Precheck (bắt buộc)
- Collections/fields liên quan:
  - `klotus_warranty_activations.warranty_start_date`
  - `klotus_warranty_activations.warranty_end_date`
- Data nền cần có:
  - activation flow đang chạy được để smoke API sau deploy
- Constraint/index/default cần có:
  - không yêu cầu đổi schema hay index; chỉ đổi business calculation ở API
- Kết quả: `DB_READY`
- Nếu `DB_GAP_FOUND`: link DB task (directus-staging): N/A

## Coordination Impact
- [ ] Directus staging schema affected
- [ ] ERP Web contract affected
- [x] No cross-system impact

## Checklist (cập nhật realtime)
- [x] 1.0 Gate 0 DB Precheck done
- [ ] 2.0 Backend workflow/API gate done
- [ ] 3.0 UI handoff gate done
- [ ] 4.0 Validate
  - [ ] 4.1 `bun run build`
  - [ ] 4.2 Smoke test affected endpoints
- [ ] 5.0 Close
  - [ ] 5.1 Lessons learned entry (if issue)
  - [ ] 5.2 Commit + push code (web/api)
  - [ ] 5.3 Summary with evidence

## Validation Evidence
- DB precheck result: DB_READY; no schema change required.
- Build:
- Smoke:

## Lessons Learned
- Link: No issue

## Commit/Push Status
- API repo:
- Web repo (if affected): N/A
- DB/directus staging: apply+verify+document (no code push required)
