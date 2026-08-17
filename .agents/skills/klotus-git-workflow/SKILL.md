---
name: klotus-git-workflow
description: Quy trình chuẩn cho thao tác Git (commit, pull, push, rebase resolve) trong workspace Klotus (landing-page-api và landing-page-web). Hỗ trợ relative paths, tự động commit local changes trước khi pull rebase, và quy trình an toàn.
---

# Klotus Git Workflow (Commit, Pull, Push & Conflict Resolution)

Skill này định nghĩa quy trình chuẩn chỉnh và an toàn tuyệt đối cho mọi thao tác Git trong các workspace Klotus (`landing-page-api` và `landing-page-web`).

---

## 1. Nguyên tắc cốt lõi & Guardrails

1. **Tuyệt đối KHÔNG chạy Git ở root workspace**:
   - Luôn `cd` vào repo con tương ứng: `./landing-page-api` hoặc `./landing-page-web`.
2. **Không bao giờ làm mất / ghi đè code (No Override)**:
   - Khi có local changes (chưa commit), **BẮT BUỘC commit trước khi pull**.
3. **Không commit file nhạy cảm**:
   - Tuyệt đối không commit các file `.env`, `.env.*`, credentials.
4. **Remote & Branch chuẩn**:
   - Remote mặc định: `github-industries` (fallback về `origin` nếu không có).
   - Branch chính: `master`.
5. **Luôn Rebase First**:
   - Dùng `git pull --rebase` để giữ lịch sử tuyến tính.

---

## 2. Quy trình Commit Code

```bash
cd ./landing-page-api # hoặc cd ./landing-page-web
git status -s
git add <danh_sach_file_code>
git commit -m "<type>(<scope>): <mô tả ngắn gọn>"
```

---

## 3. Quy trình Pull Code (Commit trước -> Pull `--rebase`)

```bash
cd ./landing-page-api # hoặc cd ./landing-page-web

# 1. Commit thay đổi cục bộ nếu có
if [ -n "$(git status -s)" ]; then
  git add <cac_file_thay_doi>
  git commit -m "chore: save local changes before pull rebase"
fi

# 2. Pull rebase
CURRENT_BRANCH=$(git branch --show-current)
REMOTE_NAME=$(git remote | grep -w github-industries || echo "origin")
git pull --rebase $REMOTE_NAME $CURRENT_BRANCH
```

---

## 4. Quy trình Push Code

```bash
cd ./landing-page-api # hoặc cd ./landing-page-web

CURRENT_BRANCH=$(git branch --show-current)
REMOTE_NAME=$(git remote | grep -w github-industries || echo "origin")

# 1. Commit nếu còn thay đổi
if [ -n "$(git status -s)" ]; then
  git add <cac_file_thay_doi>
  git commit -m "<type>(<scope>): <mo_ta>"
fi

# 2. Pull rebase mới nhất
git pull --rebase $REMOTE_NAME $CURRENT_BRANCH

# 3. QC Gates
bun run build
bun run check:ci
bun run test

# 4. Push lên remote
git push $REMOTE_NAME $CURRENT_BRANCH
```
