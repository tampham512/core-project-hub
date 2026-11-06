# Báo cáo kiểm tra workspace và database — 06/11/2026

- Task: `TASK-20261106121635-39BF40`; requirement: `REQ-workspace-database-audit`.
- Phạm vi: project hub, `core-api`, `core-app`, database cấu hình trong backend, endpoint local. Agent: Codex.
- Phương pháp: kiểm tra source/Git/config, truy vấn PostgreSQL trong transaction `READ ONLY` kết thúc bằng `ROLLBACK`, Prisma migrate diff chỉ đọc và HTTP GET. Không chạy migration, seed, sửa dữ liệu, thanh toán hoặc deploy.
- Target xác minh: `DATABASE_URL` trỏ tới PostgreSQL trên Render. `DIRECT_URL` có cùng host và tên database với `DATABASE_URL`; điều này chưa chứng minh cùng user, quyền hoặc tham số kết nối. Không ghi hostname, database name, credential hay dữ liệu cá nhân vào báo cáo. Chưa xác nhận cấu hình triển khai Render/Vercel thực tế có trùng local.

## Kết quả quan trọng

| Mức | Sai lệch / bằng chứng | Tác động và hướng xử lý |
| --- | --- | --- |
| P0 | Schema đang dùng thiếu `ManualProductGrant`, `DownloadToken.manualGrantId`; `DownloadToken.orderId` vẫn NOT NULL, trong khi Prisma yêu cầu nullable. Migration SQL có sẵn trong `core-api/docs/migrations/20261104-manual-product-grants.sql` nhưng chưa được xác nhận chạy trên target này. | Đường tạo đơn/thư viện/tải có truy vấn quyền cấp thủ công có thể lỗi; cần kiểm thử xác thực và chuẩn bị migration phù hợp trên đúng target. Không áp dụng chỉ dựa vào tên file. |
| P0 | Source Prisma có `Plan`, `PlanTemplate`, database không có; đồng thời có `VideoPlan`, `VideoPlanTemplate`. API đang đăng ký `VideoPlansModule`, bộ route `products/plans` không đăng ký. | Hai thiết kế chưa được hợp nhất. Không tạo thêm bảng hoặc xóa model trước ADR và đối chiếu phụ thuộc; nếu bật lại service `Plan` thì truy vấn sẽ lỗi trên target này. |
| P1 | `VideoPlan` và `VideoPlanTemplate` đều có 0 bản ghi; `Product.planTier` không có giá trị ở sản phẩm nào. | Danh sách gói trả 200 nhưng rỗng; không chứng minh được ba gói, checkout hoặc cấp quyền hoạt động. Cần seed có chủ đích sau khi chốt mô hình. |
| P1 | `.workspace/config.yaml` trỏ tới `../web-api`, `../web-app`, nhưng Git root thực tế là `core-api`, `core-app` nằm trong hub. `node scripts/hub.mjs init` và `validate` thất bại với ENOENT. | Script workflow không nhận diện repo. Sửa cấu hình, tài liệu setup và chạy lại validate trong task tiếp theo. |
| P1 | Không có bảng `_prisma_migrations` trong schema đang kiểm tra; thư mục `src/database/prisma/migrations` được cấu hình nhưng không tồn tại. Có 5 SQL thủ công trong `core-api/docs/migrations`. | Không thể chứng minh lịch sử áp dụng migration qua Prisma; cần lập baseline/đối chiếu lịch sử và schema thực tế trước rollout. Không coi việc không có bảng này là bằng chứng chưa từng áp dụng SQL thủ công. |
| P1 | Seed tổng trong `core-api/src/database/prisma/seed/seed.ts` gọi `clearData` và xóa nhiều bảng, gồm đơn hàng, sản phẩm và tài khoản. | Không chạy seed tổng trên database có dữ liệu. Chỉ chuẩn bị seed chuyên biệt, idempotent và xác minh target. |
| P2 | Hub phụ thuộc `yaml` 2.8.1; `npm audit --json` báo một lỗ hổng moderate GHSA-48c2-rrv3-qjmp cho phiên bản `<2.8.3`. | Lập task cập nhật dependency và kiểm thử riêng; audit này không tự thay đổi lockfile hay package version. |

## Dữ liệu tổng hợp và tính toàn vẹn

| Bảng | Số bản ghi |
| --- | ---: |
| Product | 4 |
| ProductVersion | 5 |
| ProductBundleItem | 0 |
| VideoPlan | 0 |
| VideoPlanTemplate | 0 |
| Order | 4 |
| OrderItem | 4 |
| DownloadToken | 0 |

- Sản phẩm: 2 `SKILL` và 2 `TEMPLATE`, tất cả trạng thái `PUBLISHED`; đây là dữ liệu hiện tại, không xác nhận chúng đều đang được bán trên giao diện.
- Đơn: 3 `PENDING_PAYMENT`, 1 `CANCELLED`; không có `PAID` tại thời điểm kiểm tra. Không suy luận database không có người dùng hoặc dữ liệu khác.
- Kiểm tra orphan cho parent/component bundle, product của video plan, hai quan hệ VideoPlanTemplate, order/product của OrderItem, product/order/version của DownloadToken và product của ProductVersion: mỗi phép đếm bằng 0. Một số bảng rỗng nên kết quả 0 không chứng minh hành vi runtime. Không kiểm tra toàn bộ quan hệ trong database.
- Enum `VideoPlanTier` có BASIC/PRO/PREMIUM; `VideoTemplateAccess` có PREMIUM_INCLUDED/PREMIUM_PAID; Product có `planTier`, `templateAccess`, `demoVideoUrl`.
- Các bảng `Plan`, `PlanTemplate`, `ManualProductGrant` và `_prisma_migrations` vắng mặt; không thể đếm bản ghi hay kiểm tra quan hệ cho các bảng đó.

## Kiểm tra workspace và chạy thực tế

- Git root xác minh bằng `git rev-parse`: hub và ba repo con `core-api`, `core-app`, `ai-gen-video` là các Git root riêng. Hub báo ba thư mục repo và kế hoạch là untracked. `core-api` có thay đổi sẵn tại `products/dto/product.dto.ts`, `products/products.module.ts`, `products/products.service.ts`, `schema.prisma`; `core-app` và `ai-gen-video` không báo thay đổi. Đã bảo toàn các thay đổi này.
- Windows Node `v22.17.0`, pnpm `10.33.1`, npm `10.9.2`. Đã chạy `npm ci --ignore-scripts` tại hub để khôi phục dependency từ lockfile; không đổi package manifest/lockfile. Bash trước đó dùng Node cũ không parse optional chaining, cần kiểm tra PATH riêng khi dùng script `.sh`.
- `node scripts/hub.mjs init` và `validate`: thất bại vì hai repo config không tồn tại; đây là kết quả phát hiện, không phải pass.
- `pnpm exec prisma migrate diff --from-config-datasource --to-schema src/database/prisma/schema.prisma --exit-code`: báo ba bảng thiếu và chênh lệch DownloadToken như trên. Prisma dùng `DIRECT_URL`; việc có cùng host/tên database được kiểm tra, nhưng quyền và tham số khác chưa đối chiếu. Diff không ghi database.
- Local GET `/health`, `/api/v1/plans`, `/api/v1/products`, frontend `/goi-video` và proxy `/api/v1/plans`: 200. `/api/v1/plans` trả danh sách rỗng. GET `/api/v1/downloads/library` không có phiên: 401, chỉ xác nhận yêu cầu xác thực, không kiểm tra thư viện của người dùng thật.
- Audit `npm audit --json`: 1 moderate liên quan `yaml`. Không chạy `npm audit fix`.
- Rà soát nội bộ: đối chiếu lại số lượng và kết quả diff với output kiểm tra, kiểm tra báo cáo không chứa URL kết nối hay thông tin cá nhân. Chưa có review độc lập; lỗi `validate` được ghi nhận như phát hiện, không coi là kiểm thử thành công.

## Giới hạn và công việc tiếp theo

Chưa kiểm tra login có phiên, admin, thư viện/tải khi đã xác thực, tạo đơn, payment, Redis, storage, cấu hình Vercel/Render runtime, môi trường database khác hoặc tác động trên dữ liệu thật. Không có bằng chứng một số gói seed trước đó nằm trong target hiện tại. Đề xuất tiếp theo: (1) sửa cấu hình hub và setup; (2) chốt ADR mô hình gói và lập kế hoạch tương thích; (3) chuẩn bị migration cấp quyền và seed gói riêng, kiểm chứng target và thử nghiệm trước khi áp dụng; (4) kiểm thử auth, đơn và thư viện trên môi trường phù hợp.
