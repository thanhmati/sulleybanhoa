# Hướng dẫn cấu hình ApiPay Webhook & Đối soát (Supabase Edge Functions)

Tài liệu cấu hình tích hợp tự động phát hiện giao dịch chuyển khoản cho tài khoản **MBBank (Hộ kinh doanh cá nhân / Cá nhân)** qua **ApiPay Webhooks** và **ApiPay Metrics API**.

---

## 1. Kiến trúc & Nguyên tắc an toàn

- **Xác thực Webhook:** `apipay-webhook` xác thực header `ApiPay-Signature` bằng **HMAC-SHA256 (hex)** trực tiếp trên raw request body (`await req.text()`), fail-closed `401` nếu thiếu secret hoặc chữ ký sai.
- **Tách mã đơn tự động:** Webhook `transaction.in` của ApiPay trả về nguyên văn `data.content`. Edge Function tự trích xuất mã đơn chuẩn `ORD000001` (case-insensitive) rồi gọi RPC `process_bank_payment(...)`.
- **Idempotency & Atomic:** Mọi giao dịch được ghi vào `public.bank_webhook_logs` qua `external_tx_id` (`data.transactionId` / `tx.id` dùng chung cho cả Webhook và Metrics API) với `ON CONFLICT DO NOTHING` + khóa dòng `FOR UPDATE` trên `orders`.
- **Chống nhầm Sandbox trên Production:** Mọi event có `sandbox: true` hoặc `test_txn_*` bị bỏ qua mặc định trên production, chỉ xử lý khi bật `APIPAY_ALLOW_SANDBOX=true` ở môi trường kiểm thử.
- **HTTP Status:** ApiPay retry 3 lần (5s, 20s, 1 phút) nếu nhận non-2xx. Vì vậy sau khi lưu log DB an toàn (kể cả `UNMATCHED` để gắn tay), webhook luôn trả `200 { received: true }`; chỉ trả `401` khi sai chữ ký và `500` khi lỗi DB.

---

## 2. Triển khai Edge Functions & Secrets trên Supabase

> Thay `<PROJECT_REF>` bằng Project Ref của dự án.

### Bước 2.1: Chạy Migration SQL & Deploy Edge Functions

1. Chạy file [supabase/migrations/06_switch_to_apipay.sql](file:///Users/thanhdo/sulleybanhoa/supabase/migrations/06_switch_to_apipay.sql) trên Supabase SQL Editor (sau khi xác nhận).
2. Deploy 2 Edge Functions mới và gỡ 2 Edge Functions SePay cũ:

```bash
# Webhook nhận POST từ ApiPay (tắt JWT gateway vì tự xác thực ApiPay-Signature bên trong)
supabase functions deploy apipay-webhook --no-verify-jwt --project-ref <PROJECT_REF>

# Đồng bộ đối soát dự phòng từ ApiPay Metrics API (giữ bật verify_jwt, chỉ Admin được gọi)
supabase functions deploy apipay-reconcile --project-ref <PROJECT_REF>

# (Tuỳ chọn sau khi kiểm thử ổn định) Xoá Edge Functions SePay cũ trên Supabase
supabase functions delete sepay-webhook --project-ref <PROJECT_REF>
supabase functions delete sepay-reconcile --project-ref <PROJECT_REF>
```

### Bước 2.2: Thiết lập Secrets (tuyệt đối không đưa vào `.env` frontend)

```bash
# 1. Secret của Webhook (lấy sau khi tạo Webhook trên my.apipay.vn)
supabase secrets set APIPAY_WEBHOOK_SECRET="your-apipay-webhook-secret" --project-ref <PROJECT_REF>

# 2. Cặp Access Key & Secret Key từ my.apipay.vn -> API Keys
#    (Dùng ak_test_... khi test Sandbox; đổi sang ak_live_... khi Go-Live)
supabase secrets set APIPAY_ACCESS_KEY="ak_test_..." --project-ref <PROJECT_REF>
supabase secrets set APIPAY_SECRET_KEY="your-apipay-secret-key" --project-ref <PROJECT_REF>

# 3. Cho phép nhận sự kiện sandbox khi đang test; PHẢI đặt false (hoặc unset) khi Go-Live!
supabase secrets set APIPAY_ALLOW_SANDBOX=true --project-ref <PROJECT_REF>
```

---

## 3. Kiểm thử bằng ApiPay Sandbox & Live Test

### 3.1. Sandbox Mode (`ak_test_*`)

1. Đăng nhập **my.apipay.vn** → mở **Sandbox Mode** → chuyển toggle sang **Sandbox**.
2. Tạo ngân hàng Sandbox (`test_bank_*`), tạo Test API Key (`ak_test_*`), tạo Sandbox Webhook:
   - **Webhook URL:** `https://<PROJECT_REF>.supabase.co/functions/v1/apipay-webhook`
   - Copy **Secret** dán vào `APIPAY_WEBHOOK_SECRET`.
3. Tạo giao dịch mô phỏng trên trang **Transactions** (Sandbox) hoặc gọi `POST https://app.apipay.vn/v1/payment-requests/<test_pr_...>/pay`:
   - Giao dịch chứa mã `ORD000001` → kiểm tra đơn hàng tự cập nhật realtime và log có `match_status = 'MATCHED'` / `'PARTIAL'`.
   - Giao dịch sai nội dung → xuất hiện ở mục **Đối soát CK** (`UNMATCHED`) để Admin gắn tay.

### 3.2. Live Test (trên tài khoản thật, không mất tiền)

1. Liên kết tài khoản **MBBank** trên **my.apipay.vn** (Cá nhân / Hộ kinh doanh / Doanh nghiệp hỗ trợ **Auto qua OTP**; HKD MB dùng CCCD chủ hộ).
2. Bật **Sandbox Mode** → giữ toggle ở **Live Test** → chọn tài khoản MB vừa liên kết, nhập số tiền và nội dung `ORD000001`, bấm **Create and trigger**.
3. Kiểm tra **Delivery Log** trả `200`.

---

## 4. Checklist Go-Live

1. Đặt lại biến môi trường chặn sandbox trên production:
   ```bash
   supabase secrets set APIPAY_ALLOW_SANDBOX=false --project-ref <PROJECT_REF>
   ```
2. Đổi `APIPAY_ACCESS_KEY`, `APIPAY_SECRET_KEY` sang **Live API Key** và `APIPAY_WEBHOOK_SECRET` sang secret của **Live Webhook**.
3. Trong Admin Portal (`/admin/store-config` → tab **Hoá đơn & Ngân hàng**), kiểm tra đúng Số tài khoản **MBBank** và Tên chủ tài khoản.
4. Thực hiện **1 giao dịch chuyển khoản thật giá trị nhỏ** bằng cách quét mã VietQR trên hoá đơn để xác nhận end-to-end.
