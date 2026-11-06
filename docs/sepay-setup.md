# Cấu hình thanh toán SePay

Luồng: khách đăng nhập, tạo đơn, quét VietQR. SePay gửi webhook sau khi có giao dịch; API chỉ duyệt đơn chờ khi giao dịch tiền vào đúng tài khoản đã cấu hình, nội dung chứa mã đơn và số tiền không nhỏ hơn số tiền đơn. Đơn thanh toán thành công mới mở quyền tải.

1. Trong admin DoMore, cấu hình tài khoản ngân hàng đang hoạt động. Tên ngân hàng cần là mã, tên ngắn hoặc BIN được trình tạo QR của SePay hỗ trợ; nếu ngân hàng yêu cầu tài khoản ảo, cấu hình đúng loại tài khoản đó.
2. Trong SePay, liên kết tài khoản và tạo webhook giao dịch tiền vào với URL `https://<api-host>/api/v1/payments/webhook/sepay`, định dạng JSON, chế độ bảo mật **API Key**. Chọn khóa riêng đủ mạnh và cấu hình cùng giá trị qua biến môi trường `SEPAY_WEBHOOK_SECRET` của API. Không ghi khóa vào repo. SePay gửi `Authorization: Apikey <key>`.
3. QR tự thêm `SEVQR` và mã đơn. Nếu dùng tài khoản ảo theo nội dung chuyển khoản, khai báo `SEPAY_TRANSFER_PREFIX` theo quy định của tài khoản, ví dụ `TKP001`. Kiểm tra yêu cầu của ngân hàng và tài khoản thực tế trong tài liệu SePay. Thay đổi config cần khởi động lại API.
4. Chạy thử trên SePay Test mode và môi trường không dùng tiền thật: kiểm tra QR, mã đơn, tài khoản, số tiền, trạng thái PAID, webhook trùng, sai khóa, thiếu tiền và huỷ đơn. Sau đó kiểm tra cấu hình thực tế trước khi mở bán.

Khi chưa có `SEPAY_WEBHOOK_SECRET`, webhook tự động bị từ chối và admin cần xác nhận giao dịch thủ công. Khi chưa có tài khoản ngân hàng hoạt động, API không tạo đơn chuyển khoản mới. Các gói chưa có ZIP vẫn ở trạng thái chưa mở bán. Code hiện giữ khả năng xử lý callback VNPay cũ cho giao dịch đã tồn tại; tạo thanh toán VNPay mới đã bị chặn.

Tài liệu chính thức: [QR và quy tắc ngân hàng](https://developer.sepay.vn/vi/tien-ich-khac/tao-qr-code), [định dạng webhook](https://developer.sepay.vn/en/sepay-webhooks/tich-hop-webhook), [API Key webhook](https://developer.sepay.vn/en/sepay-webhooks/xac-thuc).
