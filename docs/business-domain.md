# Business domain

- **Product:** sản phẩm số, có thể có phiên bản và file tải; catalog public và quản trị có quy tắc khác nhau.
- **Order:** giao dịch chứa sản phẩm, có trạng thái thanh toán; xác nhận thanh toán và hoàn tiền ảnh hưởng quyền tải.
- **Library/download:** quyền và liên kết tải phải được backend xác thực; không coi việc hiển thị trên FE là bằng chứng sở hữu.
- **AI Video plan/template:** source có các màn hình và dịch vụ đang phát triển; kiểm tra model, controller đang được đăng ký và schema database trước khi dựa vào hành vi.

Nguồn: `web-api/src/api/modules/{products,orders,downloads}` và `web-api/src/database/prisma/schema.prisma`. Quy tắc kinh doanh cần xác nhận với chủ sản phẩm khi source và requirement không thống nhất.
