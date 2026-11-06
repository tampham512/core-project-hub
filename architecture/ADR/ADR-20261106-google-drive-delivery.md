# ADR: Phát hành file bằng link Google Drive công khai

- Trạng thái: triển khai local theo lựa chọn của người dùng; chưa xác thực bằng file Drive thực tế.
- Admin nhập link file Drive chia sẻ công khai cho từng phiên bản gói hoặc template. Hệ thống chỉ nhận host `drive.google.com` và lưu ID file cùng resource key tùy chọn trong storage key; không thêm schema database. Các phiên bản lưu trên disk hiện hữu tiếp tục hoạt động.
- Khách yêu cầu link DoMore có thời hạn và giới hạn lượt. Khi mở link, API kiểm tra trạng thái đơn/quyền cấp và điều kiện Premium rồi chuyển hướng trình duyệt đến URL tải Google Drive. Server không truyền nội dung ZIP qua DoMore.
- Giới hạn bắt buộc: link Drive công khai có thể bị xem từ network/browser, được lưu và chia sẻ lại; token DoMore không thu hồi được bản sao link Drive đã lộ. Google có thể giới hạn lượt tải hoặc yêu cầu xác nhận tải với file lớn. Việc đăng ký link chỉ kiểm tra định dạng, không xác nhận file là ZIP hay được chia sẻ công khai. Admin cần kiểm tra file thật ở chế độ ẩn danh trước khi bán.
- Lựa chọn này không thay thế lưu trữ bền vững cho ảnh bìa, chứng từ hoặc các phiên bản đã upload lên filesystem. Quyền sở hữu Drive, quota và tuổi thọ file phụ thuộc tài khoản Google.
