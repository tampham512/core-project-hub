# Hợp đồng quản lý gói Video

Trạng thái: triển khai local, chưa xác thực end-to-end với phiên admin.

- `GET /api/v1/admin/plans`: yêu cầu `manage_products`; mỗi gói gồm `showInShowcase`, `isPublished`, `productId`, danh sách `versions` (id, version, changelog, releasedAt, fileSizeBytes), `hasDownload` và template liên kết.
- `POST /api/v1/admin/plans`, `PATCH /api/v1/admin/plans/:id`: giữ các trường hiện tại, thêm `showInShowcase` boolean tùy chọn. `isPublished` chỉ đổi qua endpoint xuất bản. Gói đang bán không nhận template chưa xuất bản hoặc chưa có phiên bản tải.
- Danh sách quyền lợi `features` là mảng tùy chọn tối đa 30 chuỗi không rỗng, mỗi chuỗi tối đa 200 ký tự. POST mặc định mảng rỗng; PATCH bỏ trường sẽ giữ quyền lợi hiện có. Public và admin trả lại mảng này để hiển thị. Quyền lợi là nội dung mô tả, không tự cấp quyền tải hoặc thay đổi tính năng của ZIP.
- `POST /api/v1/admin/products/:productId/versions`: upload multipart gồm `file`, `version`, `changelog` tùy chọn; tái sử dụng endpoint có sẵn và quyền `manage_products`. Giao diện gói dùng `productId` từ danh sách, không cần quản trị viên thao tác sản phẩm nội bộ.
- `POST /api/v1/admin/products/:productId/versions/drive`: JSON `version`, `driveUrl`, `changelog` tùy chọn; yêu cầu `manage_products`. Chỉ chấp nhận link file HTTPS `drive.google.com`; không kiểm tra tính công khai hay nội dung thực tế. Khi khách dùng token tải hợp lệ, API trả redirect tới Google Drive. Link công khai có thể bị chia sẻ lại.
- API công khai chỉ trả template đã xuất bản; `showInShowcase` và `isPublished` là hai trạng thái khác nhau. Không trả storage key.

Thay đổi là bổ sung trường; client cũ vẫn dùng được. Giá, danh sách template và tên phiên bản được lưu trong database; quyền khách đã mua vẫn dựa trên dòng hàng đã snapshot của đơn.
