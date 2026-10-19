-- Migration: 04_add_is_prepared_to_orders.sql
-- Description: Add is_prepared boolean column to orders table to track florist preparation status

-- 1. Thêm cột is_prepared vào bảng orders (mặc định false: chưa chuẩn bị)
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS is_prepared BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Comment giải thích
COMMENT ON COLUMN public.orders.is_prepared IS 'Trạng thái chuẩn bị/cắm hoa của thợ (false: chưa chuẩn bị, true: đã chuẩn bị xong)';
