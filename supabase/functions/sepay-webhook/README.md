# Hướng dẫn cấu hình SePay Webhook & Đối soát (Supabase Edge Functions)

Tài liệu cấu hình tích hợp tự động phát hiện giao dịch chuyển khoản cho tài khoản **MBBank (Hộ kinh doanh cá nhân / Cá nhân)** qua **SePay Webhooks** và **SePay API v2**.

---

## 1. Kiến trúc & Nguyên tắc an toàn

- **Xác thực Webhook:** `sepay-webhook` mặc định dùng **HMAC-SHA256** (`X-SePay-Signature` + `X-SePay-Timestamp` ký trên `{timestamp}.{raw_body}`, fail-closed `401` nếu thiếu secret).
- **Idempotency & Atomic:** Mọi giao dịch được ghi vào `public.bank_webhook_logs` qua RPC `process_sepay_payment` (`ON CONFLICT DO NOTHING` + khóa dòng `FOR UPDATE`).
- **Verdict cho SePay:**
  - `200 {"success": true}` → đơn hợp lệ được ghi nhận thanh toán (**Thành công** trên `my.sepay.vn`).
  - `200 {"success": false}` → giao dịch `UNMATCHED` / đơn đã huỷ / đã trả đủ / sai STK (**Thất bại** để review, không retry).
  - `500` → lỗi hệ thống tạm thời để SePay tự retry theo lịch Fibonacci (~33 phút).

---

## 2. Triển khai Edge Functions & Secrets trên Supabase

> Thay `<PROJECT_REF>` bằng Project Ref (`ufdkwcwegrakqlxbicdm`).

### Bước 2.1: Deploy Edge Functions

```bash
# Webhook nhận POST từ SePay (tắt JWT gateway vì tự xác thực HMAC-SHA256 / API Key bên trong)
supabase functions deploy sepay-webhook --no-verify-jwt --project-ref <PROJECT_REF>

# Đồng bộ đối soát dự phòng từ SePay API v2 (giữ bật verify_jwt, chỉ Admin được gọi)
supabase functions deploy sepay-reconcile --project-ref <PROJECT_REF>
```

### Bước 2.2: Thiết lập Secrets (tuyệt đối không đưa vào `.env` frontend)

```bash
# 1. Xác thực Webhook (khuyến nghị HMAC-SHA256)
supabase secrets set SEPAY_AUTH_MODE=hmac --project-ref <PROJECT_REF>
supabase secrets set SEPAY_WEBHOOK_SECRET="your-sepay-hmac-secret" --project-ref <PROJECT_REF>

# (Tuỳ chọn nếu chọn kiểu API Key thay cho HMAC)
# supabase secrets set SEPAY_AUTH_MODE=apikey --project-ref <PROJECT_REF>
# supabase secrets set SEPAY_WEBHOOK_API_KEY="your-sepay-api-key" --project-ref <PROJECT_REF>

# 2. Token SePay API v2 phục vụ đối soát bổ sung (my.sepay.vn -> Cài đặt công ty -> API Keys)
supabase secrets set SEPAY_API_TOKEN="your-sepay-api-token" --project-ref <PROJECT_REF>

# Khi thử với Test mode dùng sandbox API; khi Go-live đổi về https://userapi.sepay.vn/v2
supabase secrets set SEPAY_API_BASE_URL="https://userapi-sandbox.sepay.vn/v2" --project-ref <PROJECT_REF>
```

---

## 3. Kiểm thử trước bằng SePay Test mode (Sandbox)

1. Đăng nhập **my.sepay.vn** → bật **Test mode** ở thanh menu bên trái.
2. Vào **Cấu hình Công ty → Cấu trúc mã thanh toán** (trong Test mode), thêm/chỉnh mẫu:
   - **Tiền tố:** `ORD`
   - **Độ dài hậu tố:** Tối thiểu `6`, tối đa `8`
   - **Loại ký tự:** `Số nguyên`
   - **Trạng thái:** `Đang hoạt động`
3. Vào **Webhooks → Tạo webhook**:
   - **URL:** `https://<PROJECT_REF>.supabase.co/functions/v1/sepay-webhook`
   - **Loại sự kiện:** `Tiền vào`
   - **Dùng để xác thực thanh toán:** **BẬT**
   - **Chỉ gửi khi có mã thanh toán:** **TẮT** _(để giao dịch ghi sai nội dung vẫn về bảng đối soát trên Admin)_
   - **Lọc theo mã thanh toán:** **TẮT**
   - **Bảo mật:** `HMAC-SHA256` (copy Secret Key dán vào `SEPAY_WEBHOOK_SECRET` ở Bước 2.2)
4. Vào **Mô phỏng giao dịch** trên Test mode:
   - Tạo giao dịch tiền vào khớp số tiền & nội dung `ORD000558` → kiểm tra đơn hàng tự cập nhật realtime và **Lịch sử gửi** hiển thị `Thành công` (`200 {"success": true}`).
   - Thử giao dịch không có mã hoặc sai mã → kiểm tra log xuất hiện ở mục **Đối soát chuyển khoản** (`UNMATCHED`) và **Lịch sử gửi** hiển thị `Thất bại` (`200 {"success": false}`).
   - Thử với `sepay` CLI (nếu cài local):
     - `sepay webhook listen --forward http://localhost:54321/functions/v1/sepay-webhook`
     - `sepay sandbox simulate payment_in --bank-account <xid> --amount 370000 --code ORD000558`

---

## 4. Checklist Go-Live (MBBank Hộ kinh doanh cá nhân)

1. Trên **my.sepay.vn (Live)**: liên kết tài khoản **MBBank** (hỗ trợ nhận trực tiếp ở tài khoản chính).
2. Cấu hình lại **Cấu trúc mã thanh toán** (`ORD`, hậu tố `6–8`, **Số nguyên**) ở chế độ Live _(cấu hình Test mode không tự chuyển sang Live)_.
3. Tạo Webhook Live tương tự Bước 3 (bật **Tiền vào**, bật **Dùng để xác thực thanh toán**, tắt 2 bộ lọc mã thanh toán, chọn **HMAC-SHA256**), đồng thời bật:
   - **Tự động gửi lại khi server trả lỗi**
   - **Bật cảnh báo khi webhook gặp lỗi liên tiếp**
4. Tạo API Key Live trong **Cài đặt công ty → API Keys**, cập nhật `SEPAY_WEBHOOK_SECRET`, `SEPAY_API_TOKEN` và đổi `SEPAY_API_BASE_URL=https://userapi.sepay.vn/v2`.
5. Trong Admin Portal (`/admin/store-config` → tab **Hoá đơn & Ngân hàng**), nhập đúng Số tài khoản **MBBank** và Tên chủ tài khoản.
6. Thực hiện **1 giao dịch chuyển khoản thật giá trị nhỏ** qua quét VietQR trên hoá đơn để xác nhận thông suốt end-to-end.
