# Task lifecycle

Tạo bằng `./scripts/create-task.sh FEATURE "Tên task"`; sửa metadata `requirement`, `repositories` và nội dung. Tham chiếu requirement thật trước khi bắt đầu.

`TODO → IN_PROGRESS → REVIEW → DONE`; `TODO`, `IN_PROGRESS`, `REVIEW` có thể chuyển sang `BLOCKED`; `BLOCKED → IN_PROGRESS`; `REVIEW → IN_PROGRESS` khi cần sửa. Dùng `./scripts/task-status.sh TASK-ID STATUS`. DONE yêu cầu bằng chứng acceptance criteria, test và review theo task; script chỉ kiểm tra chuyển trạng thái và metadata, không tự xác minh kết quả. Không sửa status YAML thủ công mà không chuyển file tương ứng.
