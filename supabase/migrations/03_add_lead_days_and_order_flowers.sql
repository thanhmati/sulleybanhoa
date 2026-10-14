-- Migration: 03_add_lead_days_and_order_flowers.sql
-- Description: Add lead_days to flower_types and flowers array to orders

-- 1. Thêm cột lead_days (số ngày cần nhập trước, mặc định 0) vào bảng flower_types
ALTER TABLE public.flower_types
ADD COLUMN IF NOT EXISTS lead_days INTEGER NOT NULL DEFAULT 0;

-- 2. Thêm cột flowers (danh sách loại hoa sử dụng cho đơn hàng) vào bảng orders
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS flowers TEXT[] NOT NULL DEFAULT '{}'::text[];

-- Comment giải thích
COMMENT ON COLUMN public.flower_types.lead_days IS 'Số ngày cần nhập trước khi cắm/giao đơn hàng (0 = nhập trong ngày giao)';
COMMENT ON COLUMN public.orders.flowers IS 'Danh sách tên hoặc ID các loại hoa cần sử dụng cho đơn hàng';
