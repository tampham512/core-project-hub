# Development setup

1. Cài Node.js, pnpm theo từng repo, Git và Git Bash; đọc package scripts và README của từng repo.
2. Cấu hình biến môi trường bằng file ví dụ của mỗi repo. Không sao chép secret vào hub hoặc execution report.
3. FE: từ `core-app`, xem `package.json`/`apps/nextjs/project.json`; lệnh đang có gồm `pnpm dev:local` và `pnpm build:production`.
4. BE: từ `core-api`, `pnpm install`, `pnpm prisma:generate`, `pnpm start:dev`; kiểm tra config trước khi kết nối database/Redis.
5. Migration, `db:push`, seed và deploy làm thay đổi dữ liệu hoặc hạ tầng: xác định target, đánh giá tác động và chỉ chạy trong phạm vi được giao. Không mặc định URL trong env là database local.

Nguồn: `core-app/package.json`, `core-app/apps/nextjs/project.json`, `core-api/package.json`, `core-api/prisma.config.ts`. Các lệnh trên là cấu hình source, chưa xác nhận tất cả chạy thành công trong môi trường hiện tại.
