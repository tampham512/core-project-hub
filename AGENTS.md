# Hướng dẫn agent cho DoMore Project Hub

Các quy tắc này áp dụng khi làm việc trong hub. Với tác vụ ở repo khác, đọc cả hướng dẫn của repo đó và làm theo chỉ dẫn người dùng; không coi hub là quyền tự động sửa các repo khác.

## Trước khi thực hiện

1. Đọc README, requirement/task và tài liệu liên quan; kiểm tra `.workspace/config.yaml` bằng `scripts/init-workspace.sh`.
2. Kiểm tra Git status từng repo trong phạm vi; đọc `AGENTS.md` tại repo và đường dẫn liên quan nếu có. Bảo toàn thay đổi chưa commit.
3. Kiểm tra code, contract và phụ thuộc FE/BE trước khi đề xuất cách làm. Lập plan phù hợp và xác định điều kiện nghiệm thu.

## Khi thực hiện

- Theo convention repo; giới hạn thay đổi theo yêu cầu, không refactor ngoài phạm vi. Đồng bộ contract khi thay đổi API và xác nhận tương thích FE/BE.
- Thêm hoặc cập nhật test phù hợp với rủi ro. Quyết định kiến trúc quan trọng ghi ADR; tiến độ và blocker ghi vào task/execution record.
- Không tự commit, push, đổi remote, chạy migration lên môi trường không xác định, hay ghi credentials vào tài liệu. Xác nhận đúng target và quyền trước các tác động bên ngoài đáng kể.

## Kết thúc và tiếp tục

- Chạy test, lint, typecheck và kiểm thử tích hợp phù hợp nếu có; xem diff ở tất cả repo liên quan. Ghi rõ kết quả, lỗi có sẵn và phần chưa kiểm tra.
- Đồng bộ tài liệu, cập nhật task và execution report khi được yêu cầu hoặc trong workflow hub. Không đánh dấu DONE nếu acceptance criteria hoặc kiểm chứng bắt buộc còn thiếu.
- Sau gián đoạn, đọc task và execution gần nhất, đối chiếu với Git status và source hiện tại trước khi tiếp tục; không tin trạng thái trong báo cáo cũ mà chưa kiểm tra.
