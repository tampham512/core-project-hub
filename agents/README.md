# Agents

`skills/` chứa năm skill dùng chung với `name` và `description` trong YAML frontmatter; `workflows/` mô tả feature, bug fix, review và resume. `prompts/` và `rules/` chứa hướng dẫn bổ trợ, không vượt quyền người dùng hoặc hướng dẫn repo.

Các coding agent có cơ chế discovery riêng. Cách chắc chắn nhất là yêu cầu agent đọc `AGENTS.md` và `agents/skills/<tên>/SKILL.md` trực tiếp. Khi muốn tự động discover, cấu hình/cài skill theo tài liệu của công cụ tương ứng; thư mục chung ở đây không đảm bảo được Codex, Claude Code hay OpenCode tự phát hiện. Không tự tạo symlink hay sửa cấu hình toàn cục.
