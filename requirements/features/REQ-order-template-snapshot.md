# REQ-order-template-snapshot: Chốt nội dung đơn hàng

- Priority P0; trạng thái IMPLEMENTATION, chưa nghiệm thu với database thử riêng.
- Đơn lưu giá và template đi kèm khi tạo. Template thêm vào sau không tự cấp cho đơn cũ; quyền chỉ có hiệu lực khi đơn đã thanh toán hoặc có cấp quyền hợp lệ.
- Nếu giá, trạng thái, phân loại hoặc thành phần gói thay đổi giữa lần đọc và transaction tạo đơn, API từ chối để khách tải lại. Đọc các thành phần trong cùng snapshot transaction.
- Kiểm tra lại mã giảm giá trong transaction, bảo lưu lượt theo `usedCount` đã đọc và từ chối thay đổi đồng thời; rollback nếu thông tin giá/mã thay đổi.
- Task `TASK-20261106125807-BEF3E0`; không thay đổi schema hoặc dữ liệu hiện có.
