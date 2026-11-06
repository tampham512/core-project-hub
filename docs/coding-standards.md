# Coding standards

Theo convention và hướng dẫn riêng của repo đang sửa. Tách thay đổi FE/BE theo API contract, xác thực đầu vào ở BE, không coi UI là lớp bảo vệ quyền. Khi thay đổi auth, thanh toán hoặc quyền tải, kiểm tra cả tình huống từ chối và hồi quy.

Test phù hợp với thay đổi; ghi rõ lệnh, kết quả và phần chưa chạy. Tránh sửa file hoặc format toàn bộ repo ngoài scope. Không commit secrets hay dữ liệu cá nhân vào source hoặc hub.
