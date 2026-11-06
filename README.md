# DoMore Project Hub

Hub là nơi lưu requirement, đặc tả, quyết định kiến trúc, task và báo cáo agent cho DoMore. Hub là repository riêng, còn frontend và backend giữ Git và source riêng. Thông tin trong hub là tài liệu phối hợp; source code và trạng thái chạy thực tế phải được kiểm tra trước mỗi thay đổi.

## Bắt đầu

Yêu cầu: Node.js 18+, npm, Git và Git Bash trên Windows. Từ thư mục hub:

```bash
npm ci
./scripts/init-workspace.sh
./scripts/validate-workspace.sh
./scripts/create-task.sh FEATURE "Ví dụ: cải thiện trang sản phẩm"
./scripts/task-status.sh TASK-YYYYMMDDHHMMSS-ABC123 IN_PROGRESS
```

Lấy ID thực tế từ kết quả `create-task.sh`; ví dụ ID trên chỉ minh họa. Cập nhật `.workspace/config.yaml` nếu repo nằm ở vị trí khác; đường dẫn tương đối được tính từ root của hub. Không lưu secrets trong hub.

`init-workspace.sh` hiển thị trạng thái của từng Git repository được cấu hình. Trong workspace hiện tại, `EdutechPrime` còn là một Git repository cha theo dõi file FE/BE riêng; kiểm tra thêm `git -C .. status --short` khi cần đánh giá trạng thái repository cha.

## Tìm nội dung

- [Tổng quan](docs/project-overview.md), [kiến trúc](docs/system-architecture.md), [setup](docs/development-setup.md) và [quy ước](docs/coding-standards.md).
- [Yêu cầu](requirements/README.md), [task](tasks/README.md), [ADR](architecture/README.md) và [execution](execution/README.md).
- [Agent và workflows](agents/README.md), [ví dụ workflow](examples/feature-workflow.md), [API contract ví dụ](specifications/api-contracts/products-list.example.yaml).

## Đưa ngữ cảnh cho agent

Mở hub làm workspace hoặc yêu cầu agent đọc `project-hub/AGENTS.md` và tài liệu liên quan, sau đó mở các repo được cấu hình khi cần. Hướng dẫn trong hub không tự động áp dụng khi agent chỉ mở `web-app` hoặc `web-api`. Các thư mục `agents/skills/` là nguồn skill dùng chung; việc đăng ký hoặc nạp skill phụ thuộc từng công cụ, xem [agents/README.md](agents/README.md).

## Giới hạn

Các script quản lý file cục bộ, không điều phối agent, tự review, chạy test dự án, commit hoặc deploy. Kết quả kiểm tra phải do người/agent ghi dựa trên bằng chứng thật. Hub không thay thế tài liệu hay quyền truy cập repo; CI, MCP và Jira là hướng mở rộng sau.
