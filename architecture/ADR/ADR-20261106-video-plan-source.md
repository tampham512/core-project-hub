# ADR: Một nguồn dữ liệu gói VideoPlan

- Trạng thái: áp dụng trong source local; chưa deploy.
- Bối cảnh: `Plan` và `VideoPlan` cùng tồn tại trong source, frontend và database hiện dùng `VideoPlan`; database target kiểm tra không có bảng `Plan`.
- Quyết định: `VideoPlan` và `VideoPlanTemplate` là nguồn dữ liệu gói và template đi kèm. `Product` loại bundle nội bộ vẫn liên kết để tương thích checkout hiện hành; không cung cấp skill/bundle như loại gói bán độc lập. `showInShowcase` cho phép giới thiệu gói nháp; `isPublished` mới cho phép nút mua.
- Tác động: loại service/model `Plan` không được đăng ký; seed chỉ tạo các gói còn thiếu cùng product liên kết, không cập nhật giá hay quyền hiện có. Hai SQL cũ `20261104-plan-tables.sql` và `20261104-plan-showcase.sql` dành cho thiết kế đã bỏ, không áp dụng cho mô hình hiện tại.
- Giới hạn: snapshot template, checkout, quyền, thu hồi và payment chưa được kiểm chứng end-to-end. Việc tách hẳn Product nội bộ và migration lịch sử cần thiết kế, kiểm tra dữ liệu riêng. Không suy luận schema ở database khác giống target đã kiểm tra.
