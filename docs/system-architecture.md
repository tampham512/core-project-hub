# Kiến trúc hệ thống

```text
Browser -> Next.js web-app -> API proxy / HTTP -> NestJS web-api
                                                  |-> PostgreSQL / Prisma
                                                  |-> Redis
                                                  |-> Storage / Mail
```

Frontend dùng Next.js/React và các thư viện trong `web-app/libs`; backend đăng ký modules qua `web-api/src/app.module.ts`. Sản phẩm, đơn hàng và tải xuống có controller/service riêng. Đường đi xác thực và cấu hình storage phải được xác nhận trong code và môi trường trước khi thay đổi.

Nguồn: `web-app/apps/nextjs/src/app/api`, `web-api/src/app.module.ts`, `web-api/src/database/prisma/schema.prisma`. Sơ đồ là tổng quan thiết kế, không chứng nhận service đang chạy hay dữ liệu đã migrate. Ghi thay đổi kiến trúc đáng kể bằng ADR.
