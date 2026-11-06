# REQ-video-plan-management: Quản lý gói và file tải

- Ưu tiên P0; trạng thái IMPLEMENTATION, chưa nghiệm thu với phiên admin.
- Admin có quyền `manage_products` quản lý gói, danh sách template, trạng thái giới thiệu và các phiên bản ZIP ngay trong trang gói.
- Gói đang bán chỉ được liên kết template đã xuất bản có file tải; không mở bán khi gói chưa có phiên bản.
- Giá và trạng thái gói phải được quản lý đồng bộ thông qua API gói; API sản phẩm không cho sửa, xóa hay chuyển trạng thái product nội bộ đã liên kết gói.
- File tải cần đúng đuôi và signature ZIP, giới hạn kích thước theo upload controller, tránh đè file khi tạo trùng phiên bản; không trả storage key cho khách.
- Admin chỉnh danh sách quyền lợi hiển thị, dữ liệu lấy từ database; nội dung này không tự cấp quyền kỹ thuật cho gói.
- Task `TASK-20261106123729-A0ABE1`, contract `specifications/api-contracts/video-plan-admin.md`.
