# REQ-library-entitlement: Thư viện và quyền tải

- Priority P0; trạng thái IMPLEMENTATION, chưa nghiệm thu tích hợp.
- Thư viện hiển thị sản phẩm từ đơn PAID hoặc quyền cấp thủ công còn hiệu lực, phân biệt nguồn mua, kèm gói và admin cấp, tránh hiển thị trùng.
- Chỉ cho tạo và sử dụng token tải theo quyền hợp lệ, bao gồm yêu cầu Premium cho template; người dùng có thể chọn phiên bản đã được liệt kê.
- Khi API lỗi cần thông báo và cho thử lại; không khẳng định thư viện trống. File Google Drive công khai có giới hạn chia sẻ lại như ADR.
- Task `TASK-20261106130109-3970DB`.
