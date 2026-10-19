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
