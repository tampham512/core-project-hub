# Thư viện và quyền tải — 06/11/2026

- Task `TASK-20261106130109-3970DB`: source local đã triển khai, đang chờ kiểm thử tích hợp với phiên người dùng và dữ liệu thử độc lập.
- API thư viện bổ sung `source` (`PURCHASE`, `INCLUDED`, `GRANT`), không bỏ các trường hiện hữu. Dòng template giá 0 thuộc loại PREMIUM_INCLUDED được đánh dấu kèm gói; một quyền mua và một quyền admin cùng sản phẩm chỉ tạo một dòng, ưu tiên quyền mua còn hiệu lực.
- Khi sử dụng token template, điều kiện Premium còn hiệu lực được kiểm tra lại trong cùng câu lệnh cập nhật lượt tải. `Cache-Control: no-store` được thêm cho response tải. Link Drive công khai sau redirect vẫn có thể bị chia sẻ và không thể thu hồi qua token DoMore.
- UI chỉ gọi API thư viện sau khi xác thực, có thông báo lỗi/thử lại, nguồn quyền, chọn phiên bản và thông báo thiếu file. Không suy ra quyền mua mới từ danh sách template hiện tại của gói.
- Kiểm thử: API build, FE typecheck và 43 unit tests backend thành công; thêm test điều kiện Premium tại lệnh dùng token và gộp nguồn quyền. Kiểm thử đều dùng mock, không xác nhận tranh chấp database thực tế.
- Kiểm thử bổ sung qua `test/verify-render-isolated.cjs` dùng schema tạm trên Render: service Prisma thật đã kiểm tra thư viện, token, hoàn tiền, cấp thủ công và thu hồi token; schema tạm đã xóa. Chưa kiểm thử browser với phiên đã đăng nhập hay refund/revoke cạnh tranh. Theo yêu cầu người dùng, tạm bỏ qua kiểm thử Drive và SePay. Task còn IN_PROGRESS; không ghi dữ liệu thử vào bảng thật.
- Test schema tạm còn kiểm tra việc cập nhật gói sau khi tạo đơn thông qua `VideoPlansService` không làm khách nhận template mới. Test này sử dụng storage giả, không kiểm tra tải file thực tế qua trình duyệt.
- Kiểm thử bổ sung HTTP cục bộ với JWT test và PostgreSQL Render schema tạm: buyer đăng nhập giả lập nhận thư viện 200 với template thuộc đơn đã phê duyệt. Chưa chạy qua đăng nhập frontend hay browser.
