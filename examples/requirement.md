# REQ-EXAMPLE: Thông báo danh sách sản phẩm trống

**Dữ liệu minh họa**, không phải yêu cầu đã được duyệt hay tính năng đã kiểm thử.

- Priority: P2; Status: DRAFT
- Business context: khách hàng cần biết khi không có sản phẩm để xem.
- Objective: giải thích rõ trạng thái danh sách rỗng.
- Functional: khi API trả danh sách rỗng, hiển thị thông báo phù hợp; lỗi API có trạng thái riêng.
- Non-functional: thông báo dễ đọc và được công nghệ hỗ trợ tiếp cận.
- User story: là khách hàng, tôi muốn biết danh sách rỗng để hiểu không phải trang bị lỗi.
- Acceptance criteria: Given API trả `[]`, when danh sách tải xong, then hiển thị trạng thái rỗng; Given API lỗi, then không hiển thị trạng thái rỗng như thành công.
- Technical considerations: kiểm tra contract thực và thành phần sản phẩm trước khi triển khai.
- Dependencies: frontend, endpoint products; Task: TASK-EXAMPLE.
