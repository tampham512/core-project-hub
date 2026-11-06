# Tổng quan dự án

DoMore là marketplace sản phẩm số cho AI Video. Source hiện tại mô tả catalog, tài khoản, đơn hàng, thanh toán, thư viện và tải xuống. Mức độ hoàn thiện từng luồng cần xác minh bằng chạy thử, không suy ra từ việc có file.

- FE: `../web-app`, Next.js app tại `apps/nextjs`, có shared libraries trong `libs/`.
- BE: `../web-api`, NestJS, Prisma, PostgreSQL và Redis; cấu hình API prefix trong `src/main.ts`/config.
- Nguồn: `web-app/README.md`, `web-app/apps/nextjs/package.json`, `web-api/README.md`, `web-api/package.json`. README có thể cũ hơn code; đối chiếu source và environment.

Hub phối hợp công việc và giữ quyết định; code là nguồn sự thật của hành vi hiện tại, requirement/contract là mục tiêu đã được duyệt.
