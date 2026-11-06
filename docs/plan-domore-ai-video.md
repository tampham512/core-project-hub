# Kế hoạch DoMore AI Video

- Trạng thái: đề xuất, chưa phải xác nhận đã triển khai.
- Ngày: 2026-11-06. Phạm vi: project hub, `core-api`, `core-app`; `ai-gen-video` chỉ là nguồn tham chiếu về gói phát hành.
- Requirement/task: chưa tạo ID chính thức. Khi bắt đầu từng phần, tạo requirement, contract, ADR và task liên kết theo workflow của hub.
- Cơ sở: `AGENTS.md`, skill `requirement-analysis`, `cross-repo-development`, `documentation-sync`, source và kết quả chạy kiểm tra ngày lập kế hoạch.

## 1. Mục tiêu và nguyên tắc sản phẩm

DoMore bán gói công cụ AI Video và template; khách tải về và chạy bằng AI agent/CLI của chính họ trên máy. `ai-gen-video` là môi trường tạo sản phẩm của chủ dự án; chưa triển khai đóng gói engine hay tính năng tạo video trên server trong kế hoạch này. Người dùng chỉ thấy **gói** và **template**, không thấy Skill hay Bundle như loại sản phẩm độc lập.

- Gói mua một lần: Basic 69.000đ, Pro 149.000đ, Premium 249.000đ là giá seed đã cung cấp; giá giao dịch lấy từ database, quản trị được.
- Gói chứa công cụ/skill cần thiết; Premium có các template được chỉ định và có template bán riêng. Mua gói hoặc template cần đăng nhập; template bán riêng yêu cầu Premium.
- Template thêm vào Premium sau không tự cấp cho khách cũ. Cần cố định danh sách template được hưởng theo giao dịch. Nâng cấp trả toàn bộ giá gói mới, không trừ tiền đã mua gói cũ.
- Khách xem video demo template trước khi mua. Admin quản lý được các nội dung và hoạt động liên quan.
- Giữ yêu cầu bỏ qua giai đoạn 2 của kế hoạch cũ; do không có bản đánh số giai đoạn cũ trong hub, danh sách ưu tiên bên dưới không tự khẳng định tương ứng với các số giai đoạn cũ.

## 2. Hiện trạng có bằng chứng và giới hạn

1. Hub cấu hình repo `../web-api`, `../web-app` trong `.workspace/config.yaml`, trong khi source được tìm thấy là `core-api`, `core-app` trong hub. `bash scripts/init-workspace.sh` thất bại do Node trong môi trường bash không hỗ trợ cú pháp hiện tại; chạy bằng Node trên Windows lại thiếu dependency `yaml`. Cần khôi phục dependencies và kiểm tra phiên bản, cấu hình trước khi dùng script. Hub nhìn thấy ba thư mục repo là untracked; backend có bốn file sửa chưa commit, cần bảo toàn.
2. API có hai triển khai gói: `products/plans.*` dùng `Plan`, `PlanTemplate` và `video-plans/*` dùng `VideoPlan`, `VideoPlanTemplate` với sản phẩm nội bộ. Hai bộ từng trùng `/plans` và `/admin/plans`. Lần sửa gần nhất chỉ đăng ký bộ `VideoPlansModule` để tránh 500, chưa hợp nhất kiến trúc. Source có cả hai loại model; không tự xóa hoặc migrate dựa trên tên bảng.
3. Database Render đang cấu hình có `VideoPlan`, `VideoPlanTemplate`, chưa thấy `Plan`, `PlanTemplate`, `ManualProductGrant`; `VideoPlan` hiện không có bản ghi. `/api/v1/plans` và proxy trả 200 với danh sách rỗng. Bảng quyền cấp thủ công vắng mặt có thể làm các luồng đơn hàng/thư viện liên quan lỗi; cần xác minh toàn bộ schema thực tế. Không giả định đây là cùng database được dùng ở phiên làm việc trước.
4. Admin gói và trang `/goi-video` hiện dùng contract `VideoPlan` có `productSlug`, `productId`; tạo gói đồng thời tạo sản phẩm `BUNDLE` nội bộ. Trang có nút mua khi gói được xuất bản, nhưng chưa có kiểm chứng end-to-end việc thanh toán và giao quyền. Database gói rỗng nên chưa thể kiểm tra hành trình này.
5. `orders.service.ts` ghi các thành phần bundle vào order item lúc tạo đơn, còn thư viện dựa vào đơn `PAID` và cấp thủ công. Đây là snapshot lúc tạo đơn chứ chưa xác nhận là lúc thanh toán; cần quy định và kiểm thử trường hợp cấu hình template thay đổi trong khi đơn chờ.
6. API build, typecheck frontend và 14 unit test backend đã qua trong lần chạy gần nhất; điều này không chứng minh auth, payment, download hay hệ thống trên Render/Vercel đã hoạt động. Chưa kiểm thử thanh toán thật, login có phiên, phân quyền admin hoặc đối chiếu dữ liệu sản xuất.

## 3. Thứ tự triển khai và điều kiện nghiệm thu

### P0 — Cố định môi trường và dữ liệu

**Việc làm**

1. Kiểm tra root, Git status, env target FE/API/database/Redis/storage bằng thông tin đã che secret; xác định môi trường thử nghiệm và sản xuất, phiên bản Node, pnpm; sửa config hub và tài liệu setup cho đường dẫn thực tế sau khi xác minh.
2. Đối chiếu schema database với Prisma, lịch sử migration và dữ liệu hiện có theo từng môi trường. Kiểm tra `VideoPlan`, `Plan`, `Product`, `ProductBundleItem`, `Order`, `OrderItem`, `DownloadToken`, `ManualProductGrant` và enum liên quan; thống kê số bản ghi và quan hệ mồ côi, không ghi thông tin cá nhân vào báo cáo.
3. Viết báo cáo sai lệch và migration có thể chạy lại an toàn ở môi trường phù hợp, kiểm tra trước/sau bằng câu lệnh đọc; không dùng seed tổng có thể xóa dữ liệu. Chỉ áp dụng trên target đã xác định, theo quyền người dùng đã cung cấp; ghi rõ tác động, thứ tự và phương án xử lý lỗi.
4. Kiểm tra migration quyền cấp thủ công cùng các cột `DownloadToken` đi kèm, không chỉ tạo mỗi bảng thiếu.

**Nghiệm thu:** setup tái lập được; health, catalog, gói, login/thư viện không 500 do schema thiếu; có báo cáo schema và target được xác minh. Không đánh dấu hoàn thành nếu chưa chạy kiểm tra thực tế.

### P1 — Chốt một mô hình gói và API

**Thiết kế đề xuất:** dùng `VideoPlan` làm bảng gói và `VideoPlanTemplate` làm quan hệ vì source FE và bảng đang có đã dùng mô hình này. Cần ADR xác nhận mô hình gói độc lập, mô tả rõ liên kết `Product` nội bộ hiện có như giải pháp tương thích checkout tạm thời và kế hoạch thay thế nếu chuyển sang order item nhận `planId`. Không tạo thêm bảng `Plan` song song hoặc xóa bản ghi cũ tùy tiện.

1. So sánh mọi caller/controller/DTO/service và nội dung database của cả hai mô hình; chốt một bộ route, một nguồn giá, một contract FE/BE; kiểm thử để ngăn hai controller đăng ký cùng method/path. Xử lý các file `plans.*` và model không dùng sau khi chứng minh dữ liệu/phụ thuộc; tạo migration rõ ràng nếu cần.
2. Định nghĩa trường gói: mã duy nhất, tên, mô tả, giá nguyên VND, trạng thái nháp/hiển thị/bán nếu cần, thứ tự, nội dung quyền lợi, tài nguyên tải xuống, danh sách template; giá và trạng thái do server xác thực. Nếu tách hiển thị và bán, phân biệt rõ bằng contract và giao diện.
3. Tạo seed idempotent chỉ bổ sung gói còn thiếu với giá Basic/Pro/Premium như đã thống nhất; không ghi đè giá admin đã sửa. Với mô hình hiện tại, bảo đảm bản ghi Product nội bộ và VideoPlan được tạo trong cùng transaction; chưa xuất bản nếu thiếu file/điều kiện. Không dùng seed tổng.
4. Thiết kế backfill nếu đã có gói/đơn cũ: bản đồ ID, giá và quyền trước/sau, kiểm tra số lượng/tổng tiền/quyền; không thay đổi lịch sử hóa đơn hay cấp quyền thiếu căn cứ. Không tự chuyển các giao dịch không xác định.
5. Viết OpenAPI hoặc contract có ví dụ request/response, phân quyền, lỗi, trạng thái, quy tắc tương thích và version; thống nhất FE trước khi triển khai.

**Nghiệm thu:** một nguồn gói hoạt động; seed chạy hai lần không nhân bản hay đổi giá; admin tạo/sửa/xuất bản đúng điều kiện; dữ liệu lịch sử được đối chiếu; frontend nhận dữ liệu đúng contract.

### P2 — Admin quản lý đầy đủ

1. Gói: tạo/sửa giá, mô tả, quyền lợi, template đi kèm, trạng thái hiển thị/bán, phiên bản file ZIP và cảnh báo điều kiện xuất bản; lịch sử thay đổi giá/quyền lợi.
2. Template: tên, slug, nội dung, phân loại đi kèm Premium/bán riêng, giá, ảnh, video demo, thẻ, trạng thái và phiên bản ZIP; kiểm tra URL video hợp lệ, preview và phương án hiển thị khi lỗi, hỗ trợ định dạng được sản phẩm lựa chọn.
3. File: upload, xác thực kiểu/kích thước, lưu storage an toàn, version/changelog, thay phiên bản và kiểm tra link tải; quản trị gói cần thao tác rõ ràng, không yêu cầu hiểu `BUNDLE`/`SKILL` nội bộ.
4. Đơn hàng, người dùng và quyền: tìm kiếm, xem chi tiết, xác nhận/từ chối/hoàn tiền theo quyền, cấp/thu hồi thủ công có lý do, lịch sử audit, trạng thái rõ ràng. Khi thay đổi template trong gói phải giải thích không ảnh hưởng quyền cũ.
5. Phân quyền server-side theo hành động, validate dữ liệu, xử lý tải/lỗi/trống; kiểm tra quyền truy cập trực tiếp API lẫn trang.

**Nghiệm thu:** admin thực hiện toàn bộ vòng đời gói/template/đơn/quyền trong UI; user thường không được gọi API quản trị; demo và ZIP được kiểm tra thực tế trên storage thử nghiệm.

### P3 — Catalog, trang gói và trải nghiệm mua

1. `/goi-video`: hiển thị ba gói từ API, giá VND, mô tả/tính năng từ dữ liệu được quản lý, trạng thái rõ ràng, CTA phù hợp. Chỉ cho mua khi đủ điều kiện; nếu chỉ giới thiệu thì vô hiệu CTA và giải thích. Responsive, light/dark và loading/error/empty.
2. Catalog: chỉ bán template; tìm kiếm/lọc/sắp xếp, thẻ template đi kèm hoặc bán riêng, giá và điều kiện Premium. Chi tiết có video demo, nội dung, hướng dẫn, yêu cầu máy, phiên bản và điều kiện sử dụng.
3. Quy trình: chưa đăng nhập được chuyển sang đăng nhập rồi quay lại trang mua; hiển thị gói đang sở hữu, không cho mua trùng hoặc hạ cấp nếu chính sách vẫn giữ; nâng cấp tính giá gói mới, không giảm tiền gói cũ. Server kiểm tra lại mọi điều kiện và giá khi tạo đơn.
4. Với template bán riêng, giải thích khi thiếu Premium; không đưa template đi kèm vào checkout bán lẻ. Xử lý truy cập trực tiếp URL, gói ngừng bán và thay đổi giá.

**Nghiệm thu:** duyệt UI desktop/mobile; API thực tế quyết định trạng thái và giá; mọi nút chính hoạt động đúng hoặc thể hiện rõ không khả dụng; không lộ Skill/Bundle như sản phẩm bán riêng.

### P4 — Checkout, thanh toán và quyền sở hữu

1. Xác định hợp đồng đơn hàng cho plan/template, giá và tên snapshot, mã tiền tệ, trạng thái, nguồn quyền, thời điểm chốt tập template. Đề xuất chốt tại lúc tạo đơn để số tiền/nội dung khách xác nhận không thay đổi trong thời gian chờ; chỉ cấp quyền khi thanh toán thành công. Cần thể hiện rõ hạn hiệu lực đơn và xác nhận chính sách này trước khi coi là quyết định cuối.
2. Thiết kế transaction và idempotency cho tạo đơn, xác nhận thanh toán/webhook/duyệt thủ công; xác minh chữ ký nếu dùng webhook; chống xử lý lặp và điều kiện cạnh tranh. Không tin giá hoặc quyền gửi từ trình duyệt.
3. Ghi quyền gói và template một cách truy vết được theo order/payment hoặc cấp thủ công; chọn mô hình quyền rõ ràng, unique constraint phù hợp. Premium mua trước không tự nhận template mới; người mua mới nhận đúng danh sách snapshot. Làm rõ refund, revoke và xung đột khi cùng quyền đến từ nhiều nguồn.
4. Kiểm thử mua Basic, nâng Pro/Premium trả nguyên giá, template đi kèm và bán riêng; đơn chờ/hủy/thất bại/hoàn tiền, callback lặp, thay đổi giá/danh sách khi đơn chờ, mua đồng thời, API sai quyền. Dùng môi trường sandbox hoặc dữ liệu thử phù hợp; không tự tạo thanh toán thật.

**Nghiệm thu:** mỗi giao dịch được xác nhận đúng một lần, quyền và hóa đơn khớp snapshot; template thêm sau không mở cho khách cũ; kiểm tra giao dịch có cạnh tranh và callback lặp.

### P5 — Thư viện và tải xuống

1. Thư viện phân biệt gói, template đi kèm và template mua riêng; trạng thái, phiên bản, hướng dẫn, nguồn quyền, thời điểm nhận và tình trạng bị thu hồi.
2. API tải kiểm tra đăng nhập, quyền sở hữu, điều kiện Premium, trạng thái đơn/cấp thủ công và phiên bản; token ngắn hạn, không lộ storage key; xác minh lại quyền khi đổi token lấy file.
3. Hỗ trợ bản cũ/bản mới theo chính sách cập nhật được chốt; người mua trước chỉ thấy template được cấp, không suy ra quyền theo danh sách gói hiện tại. Kiểm tra revoke/refund và nhiều nguồn cấp.

**Nghiệm thu:** có quyền thì tải đúng file; user khác, token hết hạn, đơn chưa trả, quyền bị thu hồi và template không thuộc snapshot đều bị chặn; không làm mất quyền cũ hợp lệ.

### P6 — Ổn định, triển khai và vận hành

1. Test theo mức: unit cho quy tắc nghiệp vụ, integration với database thử thật và API auth, UI test cho các luồng chính, kiểm thử storage/payment sandbox; kiểm tra migration trên bản dữ liệu thử đại diện. Kiểm thử nguyên nhân 403 Render qua cookie, domain, proxy, CORS, JWT/secret và quyền thực tế; không giả định nguyên nhân.
2. Đối chiếu biến môi trường giữa local/Render/Vercel không ghi secret; log có request ID và thông tin lỗi an toàn, health check, cảnh báo lỗi, hướng dẫn khôi phục và theo dõi giao dịch.
3. Review bảo mật, truy cập, responsive, SEO/metadata, hiệu năng demo video và log/audit; ghi ADR, contract, setup, execution theo kết quả thật. Build/typecheck/test từng repo; xem diff và loại bỏ trạng thái trùng.
4. Trước khi mở bán: xác nhận file thật, quyền lợi, giá, bản quyền video/template, điều kiện hỗ trợ và phí bên thứ ba; deploy theo thứ tự tương thích schema → API → FE, smoke test đăng nhập/danh sách/mua thử/tải thử trên môi trường thích hợp.

**Nghiệm thu:** checklist và bằng chứng test có thể đối chiếu; schema/API/FE đúng phiên bản; luồng đã xác nhận end-to-end, không chỉ test mock; còn giới hạn nào phải ghi rõ.

## 4. Phụ thuộc và đề xuất chia task

| Thứ tự | Task đề xuất | Phụ thuộc | Kết quả |
| --- | --- | --- | --- |
| 1 | Kiểm tra workspace, database và báo cáo sai lệch | Không | Target và chênh lệch có bằng chứng |
| 2 | ADR mô hình gói, quyền và contract | Task 1 | Một thiết kế và API thống nhất |
| 3 | Migration an toàn và seed idempotent | Task 2 | Schema và gói mẫu khớp, giữ dữ liệu |
| 4 | Admin gói/template/phiên bản | Task 3 | Quản lý dữ liệu từ UI |
| 5 | Trang gói, catalog, demo | Task 2–4 | Khách xem đúng thông tin |
| 6 | Checkout, payment, snapshot và quyền | Task 2–3 | Đơn thanh toán mở đúng quyền |
| 7 | Thư viện và tải xuống | Task 6 | Khách tải đúng nội dung đã mua |
| 8 | Kiểm thử tích hợp, vận hành, phát hành | Task 1–7 | Bằng chứng nghiệm thu và rollout |

Số thứ tự task là thứ tự phụ thuộc, không phải đánh số lại các giai đoạn trong kế hoạch cũ. Được phép triển khai song song admin và UI sau khi contract đã chốt.

## 5. Quyết định và thông tin còn cần làm rõ

- Thời điểm chốt template của đơn đang chờ: đề xuất lúc tạo đơn; cần xác nhận vì ảnh hưởng quyền khách mua nếu admin đổi template trước khi thanh toán.
- Quyền cập nhật trọn đời áp dụng cho phiên bản gói/template nào, phiên bản mới có tính phí hay không; chưa suy ra từ giá một lần.
- Refund hoặc thu hồi Premium ảnh hưởng thế nào đến template đã mua riêng; xử lý quyền từ nhiều đơn và cấp thủ công.
- Phương thức thanh toán chính thức, thời hạn đơn chờ, chính sách hoàn tiền và môi trường sandbox.
- Nội dung tính năng cụ thể của từng gói, ZIP, video demo và hướng dẫn thực tế; không hứa tính năng nếu chưa kiểm chứng từ sản phẩm.
- Có cần hiển thị gói nháp để giới thiệu trước khi có ZIP, và có cần tách trạng thái giới thiệu khỏi trạng thái bán.

## 6. Quy trình thực hiện theo hub

Mỗi task cần requirement và acceptance criteria, trạng thái Git của từng repo, contract trước thay đổi FE/BE, kiểm thử theo rủi ro và review; cập nhật execution có kết quả/giới hạn thực tế. Quyết định kiến trúc ghi ADR, thay đổi dữ liệu có báo cáo target và tác động; chỉ đánh dấu DONE khi nghiệm thu được kiểm chứng. Không tự commit, push hoặc deploy; bảo toàn các thay đổi đang có.
