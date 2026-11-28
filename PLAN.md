# 📋 PLAN.md - Kế hoạch Chuyển đổi Dữ liệu từ Hardcode sang Supabase DB & Admin Portal

Tài liệu chi tiết phân chia công việc (Task Breakdown) cho 2 pha chuyển đổi dữ liệu từ hardcode sang Supabase Database và tích hợp giao diện Quản trị (Admin Portal) cho hệ thống **Sulley Bán Hoa**.

---

## 🟢 PHA 1: Chuyển đổi Quản lý Sản phẩm (Products DB & Admin Portal)

### 1.1 Database & Supabase Storage Setup

- [x] **Task 1.1.1:** Tạo file Migration SQL `supabase/migrations/01_create_products_table.sql` cho bảng `products`.
- [x] **Task 1.1.2:** Thiết lập Storage Bucket `product-images` với chính sách công khai.
- [x] **Task 1.1.3:** Tạo file SQL Seed Data `supabase/seed_products.sql` chứa 24 sản phẩm mẫu.

---

### 1.2 Service Layer & Data Hooks

- [x] **Task 1.2.1:** Cập nhật TypeScript types trong [src/types/product.d.ts](file:///Users/tanthanh/Documents/sulleybanhoa/src/types/product.d.ts).
- [x] **Task 1.2.2:** Tạo Service layer [src/services/productService.ts](file:///Users/tanthanh/Documents/sulleybanhoa/src/services/productService.ts) (CRUD & Upload ảnh).
- [x] **Task 1.2.3:** Tạo React Query custom hooks [src/hooks/useProducts.ts](file:///Users/tanthanh/Documents/sulleybanhoa/src/hooks/useProducts.ts).

---

### 1.3 Admin Portal Product Management (`/admin/products`)

- [x] **Task 1.3.1:** Đăng ký route `/admin/products` trong [src/app/router/routes.tsx](file:///Users/tanthanh/Documents/sulleybanhoa/src/app/router/routes.tsx) và bổ sung menu link trong [src/components/app-sidebar.tsx](file:///Users/tanthanh/Documents/sulleybanhoa/src/components/app-sidebar.tsx).
- [x] **Task 1.3.2:** Tạo trang [src/pages/product/ProductListPage.tsx](file:///Users/tanthanh/Documents/sulleybanhoa/src/pages/product/ProductListPage.tsx) sử dụng `DataTable` và công cụ bật/tắt nhanh status.
- [x] **Task 1.3.3:** Tạo Dialog Form [src/pages/product/components/ProductFormDialog.tsx](file:///Users/tanthanh/Documents/sulleybanhoa/src/pages/product/components/ProductFormDialog.tsx) tích hợp Upload ảnh Drag-Drop.
- [x] **Task 1.3.4:** Tích hợp Confirm Dialog xóa sản phẩm an toàn.

---

### 1.4 Chuyển đổi Public Storefront từ Mock sang Supabase DB

- [x] **Task 1.4.1:** Thay thế `MOCK_PRODUCTS` trong [src/pages/shop/ShopPage.tsx](file:///Users/tanthanh/Documents/sulleybanhoa/src/pages/shop/ShopPage.tsx) bằng `useProductsQuery()`.
- [x] **Task 1.4.2:** Thay thế `MOCK_PRODUCTS` trong [src/pages/shop/ProductDetailPage.tsx](file:///Users/tanthanh/Documents/sulleybanhoa/src/pages/shop/ProductDetailPage.tsx) bằng `useProductDetailQuery(id)`.
- [x] **Task 1.4.3:** Cập nhật [src/pages/landing/LandingPage.tsx](file:///Users/tanthanh/Documents/sulleybanhoa/src/pages/landing/LandingPage.tsx) và [src/components/landing/OccasionShowcase.tsx](file:///Users/tanthanh/Documents/sulleybanhoa/src/components/landing/OccasionShowcase.tsx).

---

## 🟢 PHA 2: Chuyển đổi Nội dung động Landing Page & Store Settings (`store_settings`)

### 2.1 Database Setup cho Cấu hình Tiệm Hoa

- [x] **Task 2.1.1:** Tạo file Migration SQL `supabase/migrations/02_create_store_settings_table.sql`.
- [x] **Task 2.1.2:** Tạo Seed Data ban đầu cho các keys (hero text, banners, faqs, store contact) trong `supabase/seed_store_settings.sql`.

---

### 2.2 Service & Hooks Cấu hình

- [x] **Task 2.2.1:** Tạo [src/services/storeSettingService.ts](file:///Users/tanthanh/Documents/sulleybanhoa/src/services/storeSettingService.ts).
- [x] **Task 2.2.2:** Tạo [src/hooks/useStoreSettings.ts](file:///Users/tanthanh/Documents/sulleybanhoa/src/hooks/useStoreSettings.ts).

---

### 2.3 Mở rộng Admin Portal (`/admin/setting`)

- [x] **Task 2.3.1:** Tạo [StoreConfigPage.tsx](file:///Users/tanthanh/Documents/sulleybanhoa/src/pages/setting/components/StoreConfigPage.tsx) cho phép Admin cập nhật thông tin tiệm hoa, hotline, địa chỉ và hero banner trong [src/pages/setting/SettingPage.tsx](file:///Users/tanthanh/Documents/sulleybanhoa/src/pages/setting/SettingPage.tsx).

---

### 2.4 Chuyển đổi Landing Page & Storefront Công Khai

- [x] **Task 2.4.1:** Cập nhật [ShopPage.tsx](file:///Users/tanthanh/Documents/sulleybanhoa/src/pages/shop/ShopPage.tsx) & [ContactPage.tsx](file:///Users/tanthanh/Documents/sulleybanhoa/src/pages/contact/ContactPage.tsx) đọc dữ liệu từ `useStoreSettingsQuery()`.

---

## 🟢 PHA 3: Nâng cấp Bảng Điều Khiển Admin (Admin Dashboard Stats & Financial Tracking)

### 3.1 Tích hợp Card Thống kê Thanh toán & Dư nợ Đơn hàng

- [x] **Task 3.1.1:** Bổ sung `totalPaid` và `totalDue` vào types, service layer và RPC schema.
- [x] **Task 3.1.2:** Cập nhật `StatCard` và `OrderStats` hiển thị 2 thẻ **"Đã thanh toán"** và **"Số tiền cần thu hồi"** với giao diện đồng bộ trang Đơn hàng.
- [x] **Task 3.1.3:** Nâng cấp UI chọn loại hoa (Autocomplete Multi-Select, sắp xếp A-Z) và khắc phục lỗi khởi tạo ngày giao dịch thu chi trong `FinanceTransactionFormDialog.tsx`.
- [x] **Task 3.1.4:** Tích hợp tính năng xoá khoản thanh toán đã nhập trong Chi tiết đơn hàng (`PaymentInfo.tsx`) kèm hộp thoại xác nhận `ConfirmDialog`.
- [x] **Task 3.1.5:** Chuyển đổi bộ lọc thời gian Dashboard (`DashboardFilter.tsx`) từ chọn khoảng ngày sang chọn theo tháng (mặc định tháng hiện tại), tích hợp chọn nhanh năm và nút chuyển tháng tiện lợi.

---

### 3.2 Lịch điều phối giao hoa & Tiến độ cắm hoa (Delivery Calendar & Florist Timeline - Multi View)

- [x] **Task 3.2.1:** Thiết lập kiến trúc Multi-View trong [src/pages/order/OrderListPage.tsx](file:///Users/tanthanh/Documents/sulleybanhoa/src/pages/order/OrderListPage.tsx) hỗ trợ chuyển đổi 3 chế độ xem (Bảng dữ liệu `table`, Lịch giao hoa `calendar`, Tiến độ trong ngày `timeline`) đồng bộ URL.
- [x] **Task 3.2.2:** Xây dựng component [src/pages/order/components/OrderDeliveryCalendar.tsx](file:///Users/tanthanh/Documents/sulleybanhoa/src/pages/order/components/OrderDeliveryCalendar.tsx) hiển thị lịch tháng, badge tổng đơn, thống kê trạng thái theo ngày và tương tác chuyển sang xem ngày chi tiết.
- [x] **Task 3.2.3:** Xây dựng component [src/pages/order/components/OrderFloristTimeline.tsx](file:///Users/tanthanh/Documents/sulleybanhoa/src/pages/order/components/OrderFloristTimeline.tsx) hiển thị tiến độ theo khung giờ trong ngày, thẻ đơn chi tiết cho Florist/Shipper, đổi nhanh trạng thái và in hoá đơn.
- [x] **Task 3.2.4:** Kiểm thử đồng bộ Multi-View, đảm bảo toàn vẹn dữ liệu và giữ nguyên 100% tính năng của Table view hiện tại.

---

## 🟢 PHA 4: Quản lý Loại Hoa Đơn Hàng & Kế Hoạch Nhập Hoa Theo Ngày (Flower Order Tracking & Import Planning)

### 4.1 Database Migration & SQL Setup

- [x] **Task 4.1.1:** Tạo file Migration SQL `supabase/migrations/03_add_lead_days_and_order_flowers.sql`.
- [x] **Task 4.1.2:** Thực thi SQL an toàn trên Supabase (thêm cột `lead_days` vào bảng `flower_types` và cột `flowers` vào bảng `orders`).

---

### 4.2 Service Layer & TypeScript Types

- [x] **Task 4.2.1:** Cập nhật TypeScript types trong [src/types/catalog-metadata.d.ts](file:///Users/thanhdo/Documents/Project/sulleybanhoa/src/types/catalog-metadata.d.ts) (`leadDays`) và [src/types/order.d.ts](file:///Users/thanhdo/Documents/Project/sulleybanhoa/src/types/order.d.ts) (`flowers`).
- [x] **Task 4.2.2:** Cập nhật [src/services/flowerTypeService.ts](file:///Users/thanhdo/Documents/Project/sulleybanhoa/src/services/flowerTypeService.ts) và [src/services/orderService.ts](file:///Users/thanhdo/Documents/Project/sulleybanhoa/src/services/orderService.ts) để map các trường mới.

---

### 4.3 Quản lý Số Ngày Nhập Trước Loại Hoa (`/admin/categories`)

- [x] **Task 4.3.1:** Cập nhật [FlowerTypeFormDialog.tsx](file:///Users/thanhdo/Documents/Project/sulleybanhoa/src/pages/category/components/FlowerTypeFormDialog.tsx) bổ sung field nhập số ngày cần nhập trước (`leadDays`, mặc định 0).
- [x] **Task 4.3.2:** Cập nhật bảng Loại hoa trong [CategoryManagementPage.tsx](file:///Users/thanhdo/Documents/Project/sulleybanhoa/src/pages/category/CategoryManagementPage.tsx) hiển thị cột số ngày nhập trước trực quan.

---

### 4.4 Nhập Loại Hoa trong Đơn Hàng (`/admin/orders`)

- [x] **Task 4.4.1:** Xây dựng component `OrderFlowerPicker.tsx` hỗ trợ autocomplete chọn nhiều loại hoa từ danh mục, badge tag, thêm nhanh loại hoa mới.
- [x] **Task 4.4.2:** Tích hợp picker vào form tạo đơn [OrderFormDialog.tsx](file:///Users/thanhdo/Documents/Project/sulleybanhoa/src/pages/order/components/OrderFormDialog.tsx).
- [x] **Task 4.4.3:** Tích hợp picker vào form chi tiết/chỉnh sửa đơn [OrderForm.tsx](file:///Users/thanhdo/Documents/Project/sulleybanhoa/src/pages/order/components/OrderForm.tsx) và [OrderDetailPage.tsx](file:///Users/thanhdo/Documents/Project/sulleybanhoa/src/pages/order/components/OrderDetailPage.tsx).
- [x] **Task 4.4.4:** Hiển thị danh sách hoa trong bảng đơn hàng [columns.tsx](file:///Users/thanhdo/Documents/Project/sulleybanhoa/src/pages/order/components/columns.tsx).

---

### 4.5 Thống Kê & Xem Danh Sách Hoa Cần Nhập theo Ngày Lọc

- [x] **Task 4.5.1:** Xây dựng utility tính toán ngày nhập trước: `ImportDate = DeliveryDate - LeadDays`. Thống kê theo loại hoa: số bó cần dùng, danh sách đơn hàng & ngày giao tương ứng.
- [x] **Task 4.5.2:** Xây dựng [FlowerImportDialog.tsx](file:///Users/thanhdo/Documents/Project/sulleybanhoa/src/pages/order/components/FlowerImportDialog.tsx) hiển thị danh sách hoa cần nhập chi tiết, hỗ trợ Sao chép nhanh (Zalo/tin nhắn) và In danh sách.
- [x] **Task 4.5.3:** Tích hợp nút xem danh sách hoa cần nhập kèm Badge số lượng vào [OrderFilters.tsx](file:///Users/thanhdo/Documents/Project/sulleybanhoa/src/pages/order/components/OrderFilters.tsx) và [OrderListPage.tsx](file:///Users/thanhdo/Documents/Project/sulleybanhoa/src/pages/order/OrderListPage.tsx).

---

### 4.6 Kiểm Thử & Tối Ưu

- [x] **Task 4.6.1:** Kiểm thử toàn diện các luồng nghiệp vụ (tạo/sửa đơn, cập nhật leadDays, lọc ngày và tính ngày nhập trước). Build kiểm tra TypeScript và Lint.

---

## 🟢 PHA 5: Theo dõi Tiến độ Chuẩn bị Đơn hàng cho Thợ Hoa (Florist Preparation Tracking & Filtering)

### 5.1 Database Migration & SQL Setup

- [x] **Task 5.1.1:** Tạo file Migration SQL `supabase/migrations/04_add_is_prepared_to_orders.sql`.
- [x] **Task 5.1.2:** Thực thi SQL an toàn trên Supabase (thêm cột `is_prepared BOOLEAN NOT NULL DEFAULT FALSE` vào bảng `orders`).

---

### 5.2 Service Layer & TypeScript Types

- [x] **Task 5.2.1:** Cập nhật TypeScript types trong [src/types/order.d.ts](file:///Users/thanhdo/Documents/Project/sulleybanhoa/src/types/order.d.ts) (`isPrepared: boolean`).
- [x] **Task 5.2.2:** Cập nhật [src/services/orderService.ts](file:///Users/thanhdo/Documents/Project/sulleybanhoa/src/services/orderService.ts) (map `is_prepared`, bổ sung `updatePreparationStatus`).
- [x] **Task 5.2.3:** Bổ sung React Query hook `useUpdateOrderPreparationStatus` trong [src/hooks/useOrders.ts](file:///Users/thanhdo/Documents/Project/sulleybanhoa/src/hooks/useOrders.ts).

---

### 5.3 Giao diện Quản lý Đơn hàng - Bảng dữ liệu (Table View) & Bộ lọc

- [x] **Task 5.3.1:** Cập nhật [src/pages/order/components/columns.tsx](file:///Users/thanhdo/Documents/Project/sulleybanhoa/src/pages/order/components/columns.tsx) bổ sung cột "Chuẩn bị" kèm component chuyển đổi nhanh 1-click (toggle badge).
- [x] **Task 5.3.2:** Cập nhật [src/pages/order/components/OrderFilters.tsx](file:///Users/thanhdo/Documents/Project/sulleybanhoa/src/pages/order/components/OrderFilters.tsx) bổ sung bộ lọc "Chuẩn bị" (Tất cả / Chưa chuẩn bị / Đã chuẩn bị), đồng bộ URL search params.

---

### 5.4 Giao diện Tiến độ trong ngày (Florist Timeline View) & Lịch giao hoa (Calendar View)

- [x] **Task 5.4.1:** Cập nhật [src/pages/order/components/OrderFloristTimeline.tsx](file:///Users/thanhdo/Documents/Project/sulleybanhoa/src/pages/order/components/OrderFloristTimeline.tsx):
  - Bổ sung bộ lọc trạng thái chuẩn bị (giúp thợ hoa lọc xem riêng danh sách các đơn chưa chuẩn bị).
  - Thêm thẻ/nút bấm nhanh "Đã cắm xong" / "Chưa cắm" ngay trên Card đơn hoa.
  - Bổ sung thống kê nhanh số đơn "Chưa cắm" / "Đã cắm" ở thanh điều hướng ngày.
- [x] **Task 5.4.2:** Cập nhật [src/pages/order/components/OrderDeliveryCalendar.tsx](file:///Users/thanhdo/Documents/Project/sulleybanhoa/src/pages/order/components/OrderDeliveryCalendar.tsx) hiển thị trạng thái chuẩn bị hoa trong danh sách đơn của ngày được chọn.

---

### 5.5 Form Tạo & Chỉnh sửa Đơn hàng

- [x] **Task 5.5.1:** Cập nhật [src/pages/order/components/OrderForm.tsx](file:///Users/thanhdo/Documents/Project/sulleybanhoa/src/pages/order/components/OrderForm.tsx) và [src/pages/order/components/OrderFormDialog.tsx](file:///Users/thanhdo/Documents/Project/sulleybanhoa/src/pages/order/components/OrderFormDialog.tsx) bổ sung trường trạng thái chuẩn bị hoa.

---

### 5.6 Kiểm thử & Hoàn thiện

- [x] **Task 5.6.1:** Kiểm tra TypeScript compile, build sản phẩm và kiểm thử toàn bộ luồng đổi trạng thái, lọc đơn.

---

## 🟢 PHA 6: Ghi nhớ Hiển thị Cột Bảng Dữ liệu (DataTable Column Visibility Persistence)

### 6.1 Cấu hình Persistence trong DataTable Component

- [x] **Task 6.1.1:** Nâng cấp [src/components/ui/DataTable.tsx](file:///Users/thanhdo/Documents/Project/sulleybanhoa/src/components/ui/DataTable.tsx) hỗ trợ `storageKey` và tự động lưu/khôi phục `columnVisibility` qua `localStorage`.
- [x] **Task 6.1.2:** Nâng cấp [src/components/ui/DataTableToolbar.tsx](file:///Users/thanhdo/Documents/Project/sulleybanhoa/src/components/ui/DataTableToolbar.tsx) bổ sung nút "Hiện tất cả" và "Mặc định", giữ menu mở khi toggle checkbox.

---

### 6.2 Đồng bộ các Bảng Dữ liệu trong hệ thống

- [x] **Task 6.2.1:** Cập nhật `storageKey` cho bảng Đơn hàng trong [src/pages/order/OrderListPage.tsx](file:///Users/thanhdo/Documents/Project/sulleybanhoa/src/pages/order/OrderListPage.tsx).
- [x] **Task 6.2.2:** Cập nhật `storageKey` cho bảng Sản phẩm trong [src/pages/product/ProductListPage.tsx](file:///Users/thanhdo/Documents/Project/sulleybanhoa/src/pages/product/ProductListPage.tsx) và khóa ẩn cột actions.
- [x] **Task 6.2.3:** Cập nhật `storageKey` cho bảng Người dùng trong [src/pages/user/UserListPage.tsx](file:///Users/thanhdo/Documents/Project/sulleybanhoa/src/pages/user/UserListPage.tsx).
- [x] **Task 6.2.4:** Cập nhật `storageKey` cho bảng Thu chi trong [src/pages/finance-transaction/FinanceTransactionPage.tsx](file:///Users/thanhdo/Documents/Project/sulleybanhoa/src/pages/finance-transaction/FinanceTransactionPage.tsx).

---

### 6.3 Kiểm thử & Hoàn thiện

- [x] **Task 6.3.1:** Kiểm thử reload trang, chuyển view và kiểm tra lưu trữ `localStorage`. Build kiểm tra TypeScript và Lint.

---

## 🟡 PHA 7: Nâng cấp Hoá đơn Bán hàng, VietQR Động, Xuất Ảnh & Tự động Đối soát Chuyển khoản (Chuẩn SePay)

> **Mục tiêu:** Thiết kế lại hoá đơn bán hàng theo mẫu tối giản mới (bỏ mã vạch, bổ sung dòng tiền cọc, khối VietQR động cho tài khoản **MBBank hộ kinh doanh cá nhân** với mã thanh toán `ORD000001`), hỗ trợ Admin preview/copy/tải ảnh hoá đơn gửi khách, cấu hình thông tin tiệm & ngân hàng động, và tự động ghi nhận giao dịch chuyển khoản theo đúng chuẩn kỹ thuật SePay (**EMVCo VietQR + `qrcode.react` + `html-to-image` + SePay Webhooks HMAC-SHA256 + SePay API v2 Reconciliation + Supabase Edge Functions + Supabase Realtime**).
>
> **Lưu ý an toàn Database (`AGENTS.md`):** Các bước chạy Migration SQL, deploy Edge Function và cập nhật Supabase Secrets đều tác động trực tiếp lên môi trường production và cần xác nhận của người dùng trước khi thực thi. Mọi tích hợp SePay phải test qua **Test mode (Sandbox)** trước khi chuyển sang Live.

### 7.1 Cài đặt Thư viện Open-source & Thiết lập Hạ tầng Dữ liệu

- [x] **Task 7.1.1:** Cài đặt các thư viện open-source miễn phí:
  - `qrcode.react` (`^4.2.0`, ISC) để render mã VietQR dạng SVG sắc nét nội bộ (không phụ thuộc API ảnh bên ngoài, tránh lỗi CORS khi xuất ảnh).
  - `html-to-image` (`^1.11.13`, MIT) để convert DOM hoá đơn sang PNG Blob/DataURL phục vụ Preview, Copy Clipboard và Tải ảnh.
- [x] **Task 7.1.2:** Tạo bộ hằng số danh sách ngân hàng Việt Nam chuẩn NAPAS BIN trong [src/lib/constants/vietnam-banks.constant.ts](file:///Users/tanthanh/Documents/Project/sulleybanhoa/src/lib/constants/vietnam-banks.constant.ts) (đối chiếu chuẩn `vietqr.app/banks.json`: MBBank `970422` / `MB`, ACB `970416`, VCB `970436`, TCB `970407`, BIDV `970418`, CTG `970415`, VPB `970432`, TPB `970423`, VIB `970441`, MSB `970426`, OCB `970448`, Sacombank `970403`...).
- [x] **Task 7.1.3:** Xây dựng tiện ích sinh chuỗi **EMVCo VietQR (NAPAS 247 Dynamic QR, Tag `01 = 12`)** chuẩn open-source trong [src/lib/utils/vietqr.ts](file:///Users/tanthanh/Documents/Project/sulleybanhoa/src/lib/utils/vietqr.ts):
  - Tuân thủ cấu trúc TLV (Tag-Length-Value) + checksum `CRC16-CCITT (0xFFFF)`.
  - Thiết lập `Tag 01 = 12` (Dynamic QR), số tiền nguyên VND (`Tag 54`) và nội dung thanh toán không dấu đặt ở đầu `Tag 62.08` (mặc định **`ORD000001`** — không dấu `-`, không chứa ký tự đặc biệt để tương thích tuyệt đối với **Cấu trúc mã thanh toán SePay** và không bị ngân hàng cắt đuôi memo).
  - Hỗ trợ rule đặc thù theo ngân hàng SePay (`vietqr.md`): tự thêm `SEVQR ` ở đầu nếu admin đổi sang VietinBank cá nhân/HKD, hoặc hỗ trợ số VA nếu dùng ngân hàng yêu cầu VA.
  - Chuẩn hóa hàm helper `formatOrderPaymentCode(orderNumber)` chuyển `ORD-000001` → `ORD000001` để đồng bộ cả đơn cũ lẫn đơn mới.
- [x] **Task 7.1.4:** Tạo file Migration SQL [supabase/migrations/05_bank_webhook_and_invoice_settings.sql](file:///Users/tanthanh/Documents/Project/sulleybanhoa/supabase/migrations/05_bank_webhook_and_invoice_settings.sql) _(đã tạo file — chờ xác nhận của người dùng trước khi thực thi lên Supabase production)_:
  - Cập nhật hàm `public.generate_order_number()` cho đơn hàng mới sinh định dạng liền **`ORD000001`** (thay vì `ORD-000001`), đồng thời bổ sung cột `payment_code TEXT GENERATED ALWAYS AS (UPPER(REPLACE(order_number, '-', ''))) STORED` kèm `UNIQUE INDEX` trên `public.orders` để đơn cũ và đơn mới đều khớp `ORD000001` mà không sửa dữ liệu lịch sử.
  - Tạo bảng `public.bank_webhook_logs` lưu log biến động số dư chuẩn SePay:
    - `external_tx_id TEXT UNIQUE` (lưu `payload.id` từ webhook để `INSERT ... ON CONFLICT DO NOTHING` atomic), `sepay_api_id TEXT UNIQUE` (lưu UUID từ SePay API v2 khi đối soát bổ sung).
    - `provider`, `gateway`, `account_number`, `sub_account`, `transfer_type`, `amount BIGINT` (số nguyên VND), `payment_code` (`payload.code`), `content`, `reference_code`, `transaction_date TIMESTAMPTZ`.
    - `matched_order_id`, `order_transaction_id`, `match_status` (`MATCHED | PARTIAL | OVERPAID | UNMATCHED | IGNORED | ERROR`), `webhook_success BOOLEAN` (lưu lại verdict của lần xử lý đầu tiên để retry/replay trả đúng verdict cũ), `source` (`WEBHOOK | RECONCILE_API | MANUAL_ASSIGN`), `note`, `raw_payload JSONB`, `created_at`.
  - Tạo Postgres RPC atomic `public.process_sepay_payment(...)` (dùng transaction + row lock `FOR UPDATE` trên `orders` để tránh race condition khi nhiều request/reconcile chạy song song): kiểm tra điều kiện đơn (`status != 'CANCELLED'`, chưa trả đủ `is_paid = false`), insert `order_transactions` (`type = 'BANK'`), để trigger `recalculate_order_financials` tự trừ `due_amount` & cập nhật `is_paid` (giữ nguyên `orders.status`, không ghi trùng `finance_transactions`).
  - Thiết lập RLS chặt chẽ cho `bank_webhook_logs` (Staff/Admin `SELECT`, Admin `UPDATE` để đối soát/gắn tay đơn hàng; `INSERT` chỉ qua `service_role`) và bật `supabase_realtime` publication cho `orders`, `order_transactions`, `bank_webhook_logs`.

---

### 7.2 Cấu hình Động Thông tin Tiệm & Ngân hàng trên Hoá đơn (`/admin/store-config`)

- [x] **Task 7.2.1:** Bổ sung interface `StoreInvoiceBankConfig` trong [src/types/store-setting.d.ts](file:///Users/tanthanh/Documents/Project/sulleybanhoa/src/types/store-setting.d.ts) cho key `store_invoice_bank` (`storeName`, `storePhone`, `bankBin`, `bankShortName`, `bankAccountNumber`, `bankAccountName`, `bankAccountType`, `vaNumber`, `transferPrefix`, `footerText`).
- [x] **Task 7.2.2:** Cập nhật [src/services/storeSettingService.ts](file:///Users/tanthanh/Documents/Project/sulleybanhoa/src/services/storeSettingService.ts) bổ sung `DEFAULT_STORE_INVOICE_BANK` mặc định chọn **MBBank (`bin: '970422'`, `bankShortName: 'MBBank'`, `bankAccountType: 'BUSINESS_HOUSEHOLD'`, `transferPrefix: ''`)**.
- [x] **Task 7.2.3:** Nâng cấp [src/pages/setting/components/StoreConfigPage.tsx](file:///Users/tanthanh/Documents/Project/sulleybanhoa/src/pages/setting/components/StoreConfigPage.tsx) thêm tab **"Hoá đơn & Ngân hàng"** (tách component [InvoiceBankConfigTab.tsx](file:///Users/tanthanh/Documents/Project/sulleybanhoa/src/pages/setting/components/InvoiceBankConfigTab.tsx)):
  - Form nhập Tên tiệm trên bill, SĐT tiệm, chọn Ngân hàng từ danh sách NAPAS BIN (hiển thị lưu ý SePay tương ứng theo ngân hàng — với **MBBank hộ kinh doanh cá nhân** nhận tiền trực tiếp ở STK chính, không bắt buộc VA), Số tài khoản, Tên chủ tài khoản, Tiền tố nội dung (mặc định rỗng để nội dung là `ORD000001`), Lời cảm ơn cuối bill.
  - Khung **Live Preview** mẫu hoá đơn & mã QR thử nghiệm ngay cạnh form để admin kiểm tra trực quan trước khi lưu.

---

### 7.3 Thiết kế lại Hoá đơn Bán hàng & Hỗ trợ Preview / Copy / Tải Ảnh

- [x] **Task 7.3.1:** Thiết kế lại [src/pages/order/components/OrderReceipt.tsx](file:///Users/tanthanh/Documents/Project/sulleybanhoa/src/pages/order/components/OrderReceipt.tsx) theo bố cục ảnh mẫu mới (dùng màu hex/rgb chuẩn trên nền trắng tinh khiết để tránh sai màu khi Dark Mode hoặc lỗi CSS khi xuất PNG):
  - **Header:** Tên tiệm (`store_invoice_bank.storeName`) + SĐT (`store_invoice_bank.storePhone`), gạch ngang mảnh.
  - **Tiêu đề & Meta:** `HÓA ĐƠN BÁN HÀNG` + `{paymentCode} - {DD/MM/YY HH:mm}` với `{paymentCode}` hiển thị dạng **`ORD000001`** (**bỏ mã vạch**).
  - **Khách hàng:** Layout tối giản `Khách: {client.name || 'Khách lẻ'}` (ẩn địa chỉ, SĐT khách, ngày/giờ giao, ghi chú nội bộ).
  - **Bảng sản phẩm (`Đơn giá` | `SL` | `T.tiền`):** Hiển thị 1 dòng từ đơn hàng hiện có (`1. {order.type}{order.tone ? ' - ' + order.tone : ''}`, dòng dưới canh 3 cột `{price}` | `x1` | `{price}`).
  - **Tổng kết tài chính:**
    - `Tạm tính`: `{price} đ`
    - `Vận chuyển`: `{ship} đ` (hiển thị khi `ship > 0`)
    - `Tổng cộng 1SP`: `{price + ship} đ` (in đậm, giá trị nổi bật màu vàng cam `#d99b26`)
    - `Tiền cọc`: `{deposit} đ` (bổ sung dòng tiền cọc theo yêu cầu)
    - `Đã thanh toán`: `{paidTransactions} đ` (hiển thị khi đã có giao dịch thanh toán thêm trước đó)
    - `Nợ cho đơn hàng này`: `{dueAmount} đ`
  - **Khối chuyển khoản VietQR (hiển thị khi `dueAmount > 0` và đã cấu hình ngân hàng):**
    - Bên trái: Nhãn vector `VIETQR` + `<QRCodeSVG>` từ `generateVietQRPayload(...)` theo số tiền nguyên `dueAmount` và nội dung **`ORD000001`**.
    - Bên phải (canh lề phải): `{bankShortName}` (`MBBank`) / `{bankAccountName}` / `{bankAccountNumber}`.
    - Dòng dưới: `Nội dung` (trái) | **`ORD000001`** (phải).
    - Nếu `dueAmount <= 0`: ẩn khối QR và hiển thị badge **"ĐÃ THANH TOÁN ĐỦ"**.
  - **Footer:** `{footerText}` (mặc định `Cảm ơn quý khách và hẹn gặp lại`).
- [x] **Task 7.3.2:** Nâng cấp [src/pages/order/components/OrderReceiptDialog.tsx](file:///Users/tanthanh/Documents/Project/sulleybanhoa/src/pages/order/components/OrderReceiptDialog.tsx):
  - Đọc `store_invoice_bank` qua `useStoreSettingsQuery()` và đồng bộ dữ liệu đơn hàng mới nhất (tự cập nhật ngay khi đơn hàng vừa nhận tiền qua Realtime).
  - Gắn `ref` vào container hoá đơn (`#receipt-capture`) và bổ sung tiện ích xuất ảnh (`html-to-image` với `pixelRatio: 3`, `backgroundColor: '#ffffff'`):
    - Nút **Copy ảnh**: Tạo PNG Blob và ghi vào Clipboard (`navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])`), kèm toast thông báo hoặc fallback gợi ý tải ảnh nếu trình duyệt chặn quyền Clipboard.
    - Nút **Tải ảnh**: Tạo PNG DataURL và tải xuống file `hoa-don-{paymentCode}.png`.
    - Nút **In hoá đơn**: Giữ nguyên cơ chế `window.print()` portaled 75mm cho máy in nhiệt.

---

### 7.4 Tự động Detect & Đối soát Giao dịch Chuẩn SePay (Edge Functions)

- [x] **Task 7.4.1:** Xây dựng **Supabase Edge Function** [supabase/functions/sepay-webhook/index.ts](file:///Users/tanthanh/Documents/Project/sulleybanhoa/supabase/functions/sepay-webhook/index.ts) (kèm helper [supabase/functions/\_shared/sepay.ts](file:///Users/tanthanh/Documents/Project/sulleybanhoa/supabase/functions/_shared/sepay.ts)) tuân thủ nghiêm ngặt đặc tả SePay:
  - **Fail-closed Authentication:** Đọc raw body bằng `await req.text()`. Mặc định xác thực **HMAC-SHA256** (`X-SePay-Signature: sha256=<hex>` + `X-SePay-Timestamp` ký chuỗi `{timestamp}.{raw_body}`, kiểm tra lệch tối đa 300s, so sánh constant-time); hỗ trợ fallback mode `API Key` (`Authorization: Apikey <key>` constant-time) theo cấu hình env. Từ chối `401` nếu secret env rỗng hoặc chữ ký sai.
  - **Parse & Validate dữ liệu:** Chỉ nhận `transferType === 'in'` và số tiền nguyên dương `transferAmount > 0`. Parse `transactionDate` (`YYYY-MM-DD HH:mm:ss`) theo múi giờ `+07:00` (`Asia/Ho_Chi_Minh`). Kiểm tra `accountNumber`/`subAccount` khớp với cấu hình `store_invoice_bank` (nếu đã cấu hình).
  - **Idempotency Atomic:** Ghi event vào `bank_webhook_logs` bằng `INSERT ... ON CONFLICT (external_tx_id) DO NOTHING`. Nếu giao dịch đã tồn tại (retry / manual replay): trả về `200` với đúng `{"success": existing.webhook_success}` đã lưu lần đầu để không làm sai lệch trạng thái _Thành công/Thất bại_ trên `my.sepay.vn` và không cộng tiền 2 lần. Nếu lỗi DB không lưu được event: trả `500` để SePay tự retry.
  - **Matching chuẩn SePay:** Chỉ đối chiếu qua `payload.code` (trường SePay bóc tách từ cấu trúc mã thanh toán tiền tố `ORD` + 6 chữ số nguyên, VD `ORD000001`), **không tự regex trên `content`**. Gọi RPC atomic `process_sepay_payment(...)`:
    - Khớp đơn hợp lệ (`PENDING`/`DELIVERED`, chưa `is_paid`): insert `order_transactions` (`BANK`), cập nhật `match_status` (`MATCHED` / `PARTIAL` / `OVERPAID`) và `webhook_success = true` → trả `200 {"success": true}`.
    - Không có `code` / không thấy đơn / đơn `CANCELLED` / đơn đã `is_paid = true` / sai STK / `transferType = 'out'`: lưu log (`UNMATCHED` / `IGNORED`) với `webhook_success = false` → trả `200 {"success": false}` (nhãn _Thất bại_ trên `my.sepay.vn`, không retry).
  - **Bảo mật log (`Decree 13/2023/NĐ-CP`):** Tuyệt đối không `console.log` raw payload, `content`, `description`, tên chủ tài khoản hay headers bí mật; chỉ log `eventId`, `code`, `amount`, `matchStatus`, 4 số cuối STK.
- [x] **Task 7.4.2:** Xây dựng **Supabase Edge Function** đối soát dự phòng [supabase/functions/sepay-reconcile/index.ts](file:///Users/tanthanh/Documents/Project/sulleybanhoa/supabase/functions/sepay-reconcile/index.ts) (yêu cầu JWT Admin):
  - Gọi SePay API v2 `GET https://userapi.sepay.vn/v2/transactions?since_id=...` (kèm `transaction_date_sort=asc`, `timestamp_format=iso8601`) sử dụng `SEPAY_API_TOKEN` lưu trong Supabase Secrets.
  - Dedupe theo `sepay_api_id` (UUID của API v2, tách biệt hoàn toàn với `external_tx_id` integer của webhook) và chạy cùng RPC `process_sepay_payment(...)` để bổ sung giao dịch nếu webhook bị miss sau khi hết lịch retry 33 phút.
- [x] **Task 7.4.3:** Tạo [.env.example](file:///Users/tanthanh/Documents/Project/sulleybanhoa/.env.example) (chỉ khai báo tên biến, không chứa giá trị bí mật) và tài liệu [supabase/functions/sepay-webhook/README.md](file:///Users/tanthanh/Documents/Project/sulleybanhoa/supabase/functions/sepay-webhook/README.md) hướng dẫn đầy đủ:
  - Bước 1: Test trong **SePay Test mode** (**Mô phỏng giao dịch** trên `my.sepay.vn` hoặc `sepay` CLI `sepay webhook listen` / `sepay sandbox simulate`).
  - Bước 2: Cấu hình **Cấu trúc mã thanh toán** trên `my.sepay.vn` (Tiền tố `ORD`, hậu tố 6-8 ký tự, loại **Số nguyên**).
  - Bước 3: Tạo Webhook (chọn tài khoản **MBBank hộ kinh doanh cá nhân**, bật **Tiền vào** và **Dùng để xác thực thanh toán**, **TẮT** _Chỉ gửi khi có mã thanh toán_ và _Lọc theo mã thanh toán_ để giao dịch sai nội dung vẫn về bảng đối soát, xác thực **HMAC-SHA256**).
  - Bước 4: Go-live checklist (bật _Tự động gửi lại khi server trả lỗi_ & _Cảnh báo lỗi liên tiếp_, thử 1 giao dịch thật giá trị nhỏ).

---

### 7.5 Realtime UI & Giao diện Đối soát Giao dịch Ngân hàng (`/admin/orders`)

- [x] **Task 7.5.1:** Tạo types [src/types/bank-webhook.d.ts](file:///Users/tanthanh/Documents/Project/sulleybanhoa/src/types/bank-webhook.d.ts) và service [src/services/bankWebhookService.ts](file:///Users/tanthanh/Documents/Project/sulleybanhoa/src/services/bankWebhookService.ts) (tuân thủ pattern Service Layer của `AGENTS.md`):
  - `getLogs()`: lấy danh sách `bank_webhook_logs` kèm thông tin đơn hàng liên kết.
  - `assignLogToOrder(logId, orderId)`: gọi RPC hoặc tạo `order_transactions` (`type = 'BANK'`) cho đơn được chọn và cập nhật `bank_webhook_logs` (`matched_order_id`, `order_transaction_id`, `match_status = 'MATCHED'`, `source = 'MANUAL_ASSIGN'`).
  - `ignoreLog(logId)`: đánh dấu giao dịch không liên quan (`IGNORED`).
  - `triggerReconcile()`: gọi Edge Function `sepay-reconcile` kéo giao dịch thiếu từ SePay API v2.
- [x] **Task 7.5.2:** Tạo hook [src/hooks/useBankWebhookLogs.ts](file:///Users/tanthanh/Documents/Project/sulleybanhoa/src/hooks/useBankWebhookLogs.ts):
  - React Query hooks: `useBankWebhookLogsQuery`, `useAssignWebhookLogMutation`, `useIgnoreWebhookLogMutation`, `useTriggerReconcileMutation`.
  - Hook `useOrderPaymentRealtime()`: subscribe kênh `supabase.channel('order-payments-realtime')` lắng nghe `INSERT`/`UPDATE` trên `order_transactions` và `bank_webhook_logs` để tự động invalidate `['orders']`, `['order_detail']`, `['bank_webhook_logs']`, `['dashboard-summary']` và hiển thị toast thông báo ngay khi tiền về.
- [x] **Task 7.5.3:** Xây dựng modal [src/pages/order/components/BankReconciliationDialog.tsx](file:///Users/tanthanh/Documents/Project/sulleybanhoa/src/pages/order/components/BankReconciliationDialog.tsx):
  - Hiển thị lịch sử giao dịch chuyển khoản từ webhook/API, bộ lọc theo trạng thái (`Tất cả`, `Chưa khớp`, `Chuyển thiếu`, `Đã khớp`, `Bỏ qua`).
  - Escape an toàn nội dung `content`/`description` khi hiển thị (chống XSS).
  - Nút **"Đồng bộ từ SePay"** (`triggerReconcile`), nút **Gắn vào đơn hàng** 1-click cho giao dịch sai nội dung, và nút **Bỏ qua**.
- [x] **Task 7.5.4:** Tích hợp nút **"Đối soát chuyển khoản"** (kèm badge đếm giao dịch `UNMATCHED` / `PARTIAL`) và kích hoạt `useOrderPaymentRealtime()` trong [src/pages/order/OrderListPage.tsx](file:///Users/tanthanh/Documents/Project/sulleybanhoa/src/pages/order/OrderListPage.tsx) và [src/pages/order/components/OrderDetailPage.tsx](file:///Users/tanthanh/Documents/Project/sulleybanhoa/src/pages/order/components/OrderDetailPage.tsx).

---

### 7.6 Kiểm thử & Hoàn thiện

- [ ] **Task 7.6.1:** Kiểm thử sinh mã VietQR (`generateVietQRPayload`) cho MBBank (`970422`) bằng app ngân hàng thực tế: xác minh tự điền đúng STK, số tiền `dueAmount` và nội dung `ORD000001`.
- [ ] **Task 7.6.2:** Kiểm thử xuất ảnh PNG từ `OrderReceiptDialog`: kiểm tra **Copy ảnh** (dán thử vào chat/Zalo), **Tải ảnh**, và **In nhiệt 75mm** trên cả Light/Dark theme Admin.
- [ ] **Task 7.6.3:** Viết automated tests cho webhook logic (`sepay-webhook`) theo checklist SePay: từ chối chữ ký sai (`401`), từ chối khi secret rỗng (`401`), trùng `id` trả nguyên verdict cũ không cộng 2 lần, race condition 2 request đồng thời, `UNMATCHED` / đơn huỷ / đã trả đủ trả `200 {"success": false}`.
- [ ] **Task 7.6.4:** Chạy thử trên **SePay Test mode (`Mô phỏng giao dịch`)** hoặc `sepay` CLI, kiểm thử `BankReconciliationDialog` + `sepay-reconcile` + Realtime UI, sau đó chạy `pnpm build` và `pnpm lint` kiểm tra TypeScript, ESLint và cập nhật trạng thái hoàn thành trong `PLAN.md`.

---

## 🟡 PHA 8: Chuyển đổi Hệ thống Thanh toán Tự động từ SePay sang ApiPay

> **Mục tiêu:** Thay thế hoàn toàn nhà cung cấp SePay bằng **ApiPay** (`apipay.vn`) để tối ưu chi phí giao dịch phát sinh, đồng thời giữ nguyên toàn bộ luồng nghiệp vụ hiện tại (tạo VietQR nội bộ trên hoá đơn, tự động xác nhận thanh toán qua Webhook, đối soát API bổ sung, gắn tay giao dịch sai nội dung và đồng bộ Supabase Realtime).

### 8.1 Database Migration Non-destructive

- [x] **Task 8.1.1:** Tạo file Migration SQL [supabase/migrations/06_switch_to_apipay.sql](file:///Users/thanhdo/sulleybanhoa/supabase/migrations/06_switch_to_apipay.sql) _(chờ xác nhận người dùng trước khi chạy lên Supabase production)_:
  - Cập nhật default `provider = 'APIPAY'` và bổ sung cột `is_sandbox BOOLEAN NOT NULL DEFAULT FALSE` cho bảng `public.bank_webhook_logs` (giữ nguyên toàn bộ dữ liệu lịch sử).
  - Tạo RPC atomic `public.process_bank_payment(...)` dedupe theo `external_tx_id` (`transactionId` dùng chung cho cả Webhook và Metrics API của ApiPay), khóa dòng `FOR UPDATE` trên `orders` và tự động ghi `order_transactions` (`type = 'BANK'`).

### 8.2 Supabase Edge Functions (ApiPay) & Dọn dẹp SePay

- [x] **Task 8.2.1:** Xây dựng helper [supabase/functions/\_shared/apipay.ts](file:///Users/thanhdo/sulleybanhoa/supabase/functions/_shared/apipay.ts) xác thực `ApiPay-Signature` (HMAC-SHA256 trên raw body, constant-time, fail-closed), tạo header `Authorization: Bearer base64(accessKey:secretKey)` và trích xuất mã đơn `ORD000001` từ `data.content`.
- [x] **Task 8.2.2:** Xây dựng Edge Function [supabase/functions/apipay-webhook/index.ts](file:///Users/thanhdo/sulleybanhoa/supabase/functions/apipay-webhook/index.ts):
  - Đọc `await req.text()`, verify `ApiPay-Signature` trước khi parse JSON (`401` nếu sai/thiếu secret).
  - Bỏ qua mặc định sự kiện `sandbox: true` / `test_txn_*` trên production (chỉ cho phép khi `APIPAY_ALLOW_SANDBOX=true`).
  - Xử lý `event === 'transaction.in'`, gọi RPC `process_bank_payment(...)`, trả `200` sau khi lưu DB thành công (kể cả `UNMATCHED`) để tránh retry thừa; trả `500` nếu lỗi DB.
- [x] **Task 8.2.3:** Xây dựng Edge Function đối soát dự phòng [supabase/functions/apipay-reconcile/index.ts](file:///Users/thanhdo/sulleybanhoa/supabase/functions/apipay-reconcile/index.ts) (JWT role `administrator`) gọi `GET https://app.apipay.vn/v1/client/metrics/transactions`.
- [x] **Task 8.2.4:** Gỡ bỏ các file SePay cũ (`supabase/functions/sepay-webhook/`, `supabase/functions/sepay-reconcile/`, `supabase/functions/_shared/sepay.ts`, `sepay-doc.md`) và viết hướng dẫn cấu hình tại [supabase/functions/apipay-webhook/README.md](file:///Users/thanhdo/sulleybanhoa/supabase/functions/apipay-webhook/README.md).

### 8.3 Cập nhật Frontend & Cấu hình

- [x] **Task 8.3.1:** Cập nhật [src/types/bank-webhook.d.ts](file:///Users/thanhdo/sulleybanhoa/src/types/bank-webhook.d.ts) và [src/services/bankWebhookService.ts](file:///Users/thanhdo/sulleybanhoa/src/services/bankWebhookService.ts) (gọi `apipay-reconcile`, đọc `is_sandbox`).
- [x] **Task 8.3.2:** Cập nhật danh sách ngân hàng [src/lib/constants/vietnam-banks.constant.ts](file:///Users/thanhdo/sulleybanhoa/src/lib/constants/vietnam-banks.constant.ts), [src/lib/utils/vietqr.ts](file:///Users/thanhdo/sulleybanhoa/src/lib/utils/vietqr.ts) (bỏ prefix `SEVQR` đặc thù SePay), [BankReconciliationDialog.tsx](file:///Users/thanhdo/sulleybanhoa/src/pages/order/components/BankReconciliationDialog.tsx), [OrderListPage.tsx](file:///Users/thanhdo/sulleybanhoa/src/pages/order/OrderListPage.tsx), [InvoiceBankConfigTab.tsx](file:///Users/thanhdo/sulleybanhoa/src/pages/setting/components/InvoiceBankConfigTab.tsx) và [.env.example](file:///Users/thanhdo/sulleybanhoa/.env.example).

### 8.4 Kiểm thử & Triển khai Production

- [x] **Task 8.4.1:** Viết và chạy unit test [supabase/functions/\_shared/apipay.test.ts](file:///Users/thanhdo/sulleybanhoa/supabase/functions/_shared/apipay.test.ts) + chạy `pnpm build` & `pnpm lint`.
- [x] **Task 8.4.2:** Chạy migration `06_switch_to_apipay.sql` lên Supabase (`ufdkwcwegrakqlxbicdm`) và deploy `apipay-webhook` (`verify_jwt: false`) & `apipay-reconcile` (`verify_jwt: true`) thành công.
- [ ] **Task 8.4.3:** Cấu hình Secrets (`APIPAY_WEBHOOK_SECRET`, `APIPAY_ACCESS_KEY`, `APIPAY_SECRET_KEY`, `APIPAY_ALLOW_SANDBOX`), gỡ `sepay-webhook` / `sepay-reconcile` trên Supabase Dashboard, và kiểm thử **ApiPay Sandbox (`ak_test_`)** → **Live Test** → **Live Key** (`APIPAY_ALLOW_SANDBOX=false`) với 1 giao dịch thật giá trị nhỏ.

---

## 🟢 PHA 9: Hoá đơn Đặt cọc (Mặc định 200k) & Tự động Cập nhật Tiền cọc qua ApiPay

> **Mục tiêu:** Cho phép tạo/xem trước/copy ảnh/in **Hoá đơn đặt cọc** (mặc định 200.000 đ, có thể cấu hình tại Store Config và chỉnh nhanh trên popup), sinh mã VietQR với nội dung `COC ORD...`, đồng thời tự động cập nhật `orders.deposit` khi nhận tiền cọc qua ApiPay mà không trừ nợ 2 lần.

- [x] **Task 9.1.1:** Thêm `defaultDepositAmount` (mặc định `200000`) vào [src/types/store-setting.d.ts](file:///Users/thanhdo/sulleybanhoa/src/types/store-setting.d.ts), [src/services/storeSettingService.ts](file:///Users/thanhdo/sulleybanhoa/src/services/storeSettingService.ts) và tab cấu hình [src/pages/setting/components/InvoiceBankConfigTab.tsx](file:///Users/thanhdo/sulleybanhoa/src/pages/setting/components/InvoiceBankConfigTab.tsx) (kèm preview chuyển đổi Bán hàng / Đặt cọc).
- [x] **Task 9.1.2:** Nâng cấp [src/lib/utils/vietqr.ts](file:///Users/thanhdo/sulleybanhoa/src/lib/utils/vietqr.ts) (`isDeposit` gắn tiền tố `COC`), [src/pages/order/components/OrderReceipt.tsx](file:///Users/thanhdo/sulleybanhoa/src/pages/order/components/OrderReceipt.tsx) (mẫu `HÓA ĐƠN ĐẶT CỌC`, `Cần đặt cọc`, `Còn lại sau cọc`, badge `ĐÃ NHẬN ĐẶT CỌC`), [src/pages/order/components/OrderReceiptDialog.tsx](file:///Users/thanhdo/sulleybanhoa/src/pages/order/components/OrderReceiptDialog.tsx) (tab chuyển chế độ + chỉnh nhanh tiền cọc), và [src/pages/order/components/OrderActionsCell.tsx](file:///Users/thanhdo/sulleybanhoa/src/pages/order/components/OrderActionsCell.tsx) (mục `In bill đặt cọc`).
- [x] **Task 9.1.3:** Tạo migration [supabase/migrations/07_deposit_invoice_and_webhook.sql](file:///Users/thanhdo/sulleybanhoa/supabase/migrations/07_deposit_invoice_and_webhook.sql), cập nhật [supabase/functions/\_shared/apipay.ts](file:///Users/thanhdo/sulleybanhoa/supabase/functions/_shared/apipay.ts) & [apipay.test.ts](file:///Users/thanhdo/sulleybanhoa/supabase/functions/_shared/apipay.test.ts) để tự động nhận diện giao dịch cọc và cộng trực tiếp vào `orders.deposit` (tránh double-counting với `order_transactions`), kèm RPC `reconcile_bank_log_to_order`.
- [x] **Task 9.1.4:** Nâng cấp đối soát thủ công tại [src/services/bankWebhookService.ts](file:///Users/thanhdo/sulleybanhoa/src/services/bankWebhookService.ts), [src/hooks/useBankWebhookLogs.ts](file:///Users/thanhdo/sulleybanhoa/src/hooks/useBankWebhookLogs.ts), [src/pages/order/OrderListPage.tsx](file:///Users/thanhdo/sulleybanhoa/src/pages/order/OrderListPage.tsx) và [src/pages/order/components/BankReconciliationDialog.tsx](file:///Users/thanhdo/sulleybanhoa/src/pages/order/components/BankReconciliationDialog.tsx) (gợi ý & cho chọn `Gắn Tiền cọc` / `Gắn Thanh toán`).
- [x] **Task 9.1.5:** Chạy migration `07_deposit_invoice_and_webhook.sql`, deploy lại `apipay-webhook` & `apipay-reconcile`, và kiểm thử `node --test`, `pnpm build`, `pnpm lint`.
