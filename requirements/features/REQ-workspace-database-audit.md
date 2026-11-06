# REQ-workspace-database-audit: Kiểm tra workspace và database

- Priority: P0
- Status: IMPLEMENTED (phạm vi kiểm tra và báo cáo; không đồng nghĩa đã sửa sai lệch)
- Ngày: 2026-11-06

## Mục tiêu

Xác định các repo và target database mà source hiện tại sử dụng, đối chiếu cấu hình, schema và dữ liệu tổng hợp để tạo báo cáo làm cơ sở sửa lỗi mà không thay đổi dữ liệu.

## Phạm vi và tiêu chí

- Xác minh cấu hình hub so với Git root thực tế, tình trạng thay đổi và công cụ thiết yếu.
- Chỉ đọc metadata database, sự khác biệt schema Prisma, migration history có thể truy cập, số lượng tổng hợp và một số quan hệ quan trọng; không công bố secret hoặc dữ liệu cá nhân.
- Kiểm tra các endpoint công khai đang chạy và nêu rõ phạm vi chưa kiểm chứng.
- Phân loại sai lệch, tác động, bằng chứng, hướng xử lý và liên kết task tiếp theo. Không chạy migration, seed, thao tác thanh toán hoặc thay đổi dữ liệu.

Task: `TASK-20261106121635-39BF40`. Kế hoạch: `docs/plan-domore-ai-video.md`. Kết quả: `execution/history/EXEC-20261106-workspace-database-audit.md`.
