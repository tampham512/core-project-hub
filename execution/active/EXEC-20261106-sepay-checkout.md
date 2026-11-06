# SePay QR và webhook — 06/11/2026

- Task `TASK-20261106123507-876B37`: code local hoàn thành, chờ kiểm thử sandbox và cấu hình; chưa deploy.
- Đã triển khai QR theo tài khoản/giá/mã đơn và polling trạng thái đơn có đăng nhập; API chỉ cho tạo phương thức BANK_TRANSFER, khóa tạo thanh toán VNPay mới, giữ callback cũ cho các giao dịch lịch sử.
- Webhook nhận payload phẳng SePay, xác thực API Key, kiểm tra loại giao dịch, tài khoản đã cấu hình, số tiền, mã đơn và trạng thái; event upsert và chuyển trạng thái PAID có điều kiện trong transaction cùng audit. Thao tác hủy/duyệt/từ chối chỉ chuyển từ PENDING_PAYMENT.
- Cập nhật theo yêu cầu tạm bỏ qua SePay: API cho tạo đơn chuyển khoản khi thiếu secret để admin xác nhận thủ công; vẫn từ chối nếu thiếu tài khoản nhận hoặc tổng tiền bằng 0. Webhook tự động không hoạt động khi chưa có secret.
- Build API đạt; 23 unit tests đạt; frontend typecheck đạt; GET payment methods trả duy nhất SePay 200; webhook không key trả 401. Các test dùng mock, không chứng minh giao dịch ngân hàng thực tế.
- Kết quả kiểm tra local: có 1 tài khoản ngân hàng hoạt động, `SEPAY_WEBHOOK_SECRET` chưa được thiết lập. Chưa xác minh tài khoản đã liên kết SePay, mã ngân hàng, kiểu tài khoản ảo, webhook URL internet, hay thanh toán sandbox. Chưa kiểm thử giao diện checkout đầy đủ bằng tài khoản thật. Các gói nháp chưa có ZIP và chưa mở bán.
- Cần làm: cấu hình API key riêng tại API và SePay, xác nhận quy tắc tài khoản/QR, thử SePay Test mode với endpoint truy cập được từ SePay, kiểm tra thành công/từ chối/lặp và quyền sau thanh toán; xác nhận chính sách lịch sử VNPay và tiếp tục các task còn lại của kế hoạch.
