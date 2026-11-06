# REQ-sepay-checkout: Thanh toán chuyển khoản QR SePay

- Priority: P0; trạng thái: IMPLEMENTATION / REVIEW, chưa nghiệm thu sandbox.
- Khách đăng nhập mua gói/template, nhận QR theo số tiền và mã đơn. API xác thực webhook SePay và xác nhận đơn chờ theo tài khoản, mã, số tiền; giao dịch trùng không xác nhận hai lần. Không hỗ trợ tạo thanh toán VNPay mới.
- Cho phép tạo đơn chuyển khoản để xác nhận thủ công khi chưa cấu hình SePay; không tạo đơn nếu thiếu tài khoản ngân hàng nhận tiền. Giữ giao dịch VNPay cũ để tương thích lịch sử.
- Kiểm thử cần có sandbox thực tế trước khi mở bán. Task: `TASK-20261106123507-876B37`; hướng dẫn `docs/sepay-setup.md`.
