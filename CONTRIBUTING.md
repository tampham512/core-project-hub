# Đóng góp

1. Xem `git status` tại hub và từng repo liên quan; không ghi đè thay đổi sẵn có.
2. Viết requirement hoặc task từ template, liên kết ID, nêu scope và acceptance criteria có thể kiểm tra.
3. Với thay đổi API, đề xuất contract và kiểm tra cả FE lẫn BE trước khi coi là hoàn tất. Dùng ADR cho lựa chọn kiến trúc có tác động lớn.
4. Ghi lệnh kiểm thử và kết quả thực tế trong execution report; không ghi URL chứa mật khẩu, token, log nhạy cảm hoặc hội thoại thô.
5. Chạy `npm test` và `./scripts/validate-workspace.sh` cho thay đổi hub; review diff trước khi bàn giao. Commit/push chỉ khi người dùng yêu cầu.
