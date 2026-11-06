# Ví dụ workflow feature

Ví dụ giả định, không khẳng định tính năng đã tồn tại: REQ-EXAMPLE yêu cầu hiển thị thông báo khi danh sách sản phẩm rỗng.

Xem [requirement mẫu](requirement.md), [task mẫu](task.md) và [execution mẫu](execution-report.md); các file này không nằm trong lifecycle thật.

1. Sao chép requirement template, viết mục tiêu, AC: “khi API trả danh sách rỗng, người dùng nhìn thấy thông báo phù hợp”.
2. Kiểm tra contract danh sách sản phẩm, FE hiện tại và error state. Tạo task bằng `./scripts/create-task.sh FEATURE "Empty product list message"`; gắn requirement, repo frontend và test plan.
3. Chuyển task sang IN_PROGRESS, ghi execution report từ template, triển khai theo phạm vi được duyệt và chạy kiểm tra thực tế.
4. Đưa task sang REVIEW, review và ghi kết quả; chỉ chuyển DONE khi AC được xác minh. Nếu chưa có backend hoặc môi trường, ghi blocker thay vì giả kết quả.
