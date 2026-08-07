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
