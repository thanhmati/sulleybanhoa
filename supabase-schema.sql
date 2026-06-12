-- ============================================================================
-- SULLEY BÁN HOA - DATABASE MIGRATION SCHEMA (POSTGRESQL)
-- Copy and paste this script into the SQL Editor of your Supabase project.
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  roles TEXT[] NOT NULL DEFAULT ARRAY['sales'::TEXT],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  delivery_time TEXT,
  delivery_date DATE NOT NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT,
  address TEXT NOT NULL,
  type TEXT NOT NULL,
  tone TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  deposit NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  ship NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  note TEXT,
  status TEXT NOT NULL CHECK (status IN ('PENDING', 'DELIVERED', 'CANCELLED', 'RETURNED')) DEFAULT 'PENDING',
  due_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  is_paid BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Order Transactions Table (Normalized nested transactions)
CREATE TABLE IF NOT EXISTS public.order_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('CASH', 'BANK')),
  payment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Finance Categories Table
CREATE TABLE IF NOT EXISTS public.finance_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL, -- e.g., 'FLOWER_STOCK', 'PACKAGING_SUPPLIES', etc.
  type TEXT NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Finance Transactions Table
CREATE TABLE IF NOT EXISTS public.finance_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount NUMERIC(12, 2) NOT NULL,
  note TEXT,
  category_id UUID NOT NULL REFERENCES public.finance_categories(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================================
-- FUNCTIONS AND TRIGGERS FOR SEQUENCES AND AUTOMATED CALCULATIONS
-- ============================================================================

-- A. Automated order_number Generator (e.g. ORD-000001)
CREATE SEQUENCE IF NOT EXISTS public.order_number_seq START WITH 1;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := 'ORD-' || TO_CHAR(NEXTVAL('public.order_number_seq'), 'FM000000');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generate_order_number ON public.orders;
CREATE TRIGGER trigger_generate_order_number
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.generate_order_number();


-- B. Automated Financial Calculations (Recalculate due_amount and is_paid)
CREATE OR REPLACE FUNCTION public.recalculate_order_financials()
RETURNS TRIGGER AS $$
DECLARE
  v_order_id UUID;
  v_price NUMERIC(12, 2);
  v_deposit NUMERIC(12, 2);
  v_ship NUMERIC(12, 2);
  v_total_transactions NUMERIC(12, 2);
  v_due_amount NUMERIC(12, 2);
  v_is_paid BOOLEAN;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_order_id := OLD.order_id;
  ELSE
    v_order_id := NEW.order_id;
  END IF;

  SELECT price, deposit, ship INTO v_price, v_deposit, v_ship
  FROM public.orders WHERE id = v_order_id;

  SELECT COALESCE(SUM(amount), 0) INTO v_total_transactions
  FROM public.order_transactions WHERE order_id = v_order_id;

  v_due_amount := (v_price + v_ship) - (v_deposit + v_total_transactions);
  v_is_paid := (v_due_amount <= 0);

  UPDATE public.orders
  SET due_amount = v_due_amount,
      is_paid = v_is_paid,
      updated_at = NOW()
  WHERE id = v_order_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_recalc_financials_on_transaction ON public.order_transactions;
CREATE TRIGGER trigger_recalc_financials_on_transaction
AFTER INSERT OR UPDATE OR DELETE ON public.order_transactions
FOR EACH ROW EXECUTE FUNCTION public.recalculate_order_financials();


CREATE OR REPLACE FUNCTION public.recalculate_order_financials_on_order_update()
RETURNS TRIGGER AS $$
DECLARE
  v_total_transactions NUMERIC(12, 2);
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO v_total_transactions
  FROM public.order_transactions WHERE order_id = NEW.id;

  NEW.due_amount := (NEW.price + NEW.ship) - (NEW.deposit + v_total_transactions);
  NEW.is_paid := (NEW.due_amount <= 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_recalc_financials_on_order ON public.orders;
CREATE TRIGGER trigger_recalc_financials_on_order
BEFORE INSERT OR UPDATE OF price, deposit, ship ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.recalculate_order_financials_on_order_update();





-- ============================================================================
-- USER SYNC AND AUTH INTEGRATION FUNCTIONS
-- ============================================================================

-- D. Sync User Roles from profiles back to auth.users app_metadata
CREATE OR REPLACE FUNCTION public.sync_user_roles_to_metadata()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::JSONB) || jsonb_build_object('roles', NEW.roles)
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_sync_user_roles ON public.profiles;
CREATE TRIGGER trigger_sync_user_roles
  AFTER UPDATE OF roles ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.sync_user_roles_to_metadata();


-- E. Automatically create public profile on auth user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url, roles)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url',
    ARRAY['sales'::TEXT]
  );

  UPDATE auth.users
  SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::JSONB) || '{"roles": ["sales"]}'::JSONB
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_transactions ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Allow authenticated read profiles" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow owners to update name/avatar" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND roles = roles); -- Prevent self role updates

CREATE POLICY "Admins can update anything on profiles" ON public.profiles
  FOR ALL TO authenticated
  USING (COALESCE((auth.jwt() -> 'app_metadata' -> 'roles')::jsonb, '[]'::jsonb) ? 'administrator');

-- Orders & Order Transactions Policies
CREATE POLICY "Staff can select/insert/update orders" ON public.orders
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (
    COALESCE((auth.jwt() -> 'app_metadata' -> 'roles')::jsonb, '[]'::jsonb) ? 'administrator' OR
    COALESCE((auth.jwt() -> 'app_metadata' -> 'roles')::jsonb, '[]'::jsonb) ? 'sales'
  );

CREATE POLICY "Only admins can delete orders" ON public.orders
  FOR DELETE TO authenticated
  USING (COALESCE((auth.jwt() -> 'app_metadata' -> 'roles')::jsonb, '[]'::jsonb) ? 'administrator');
  
CREATE POLICY "Staff can select/insert/update order_transactions" ON public.order_transactions
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Only admins can delete order_transactions" ON public.order_transactions
  FOR DELETE TO authenticated
  USING (COALESCE((auth.jwt() -> 'app_metadata' -> 'roles')::jsonb, '[]'::jsonb) ? 'administrator');

-- Finance Policies
CREATE POLICY "Authenticated read finance_categories" ON public.finance_categories
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin manage finance_categories" ON public.finance_categories
  FOR ALL TO authenticated
  USING (COALESCE((auth.jwt() -> 'app_metadata' -> 'roles')::jsonb, '[]'::jsonb) ? 'administrator');

CREATE POLICY "Authenticated read finance_transactions" ON public.finance_transactions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin manage finance_transactions" ON public.finance_transactions
  FOR ALL TO authenticated
  USING (COALESCE((auth.jwt() -> 'app_metadata' -> 'roles')::jsonb, '[]'::jsonb) ? 'administrator');


-- ============================================================================
-- DASHBOARD SUMMARY RPC FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_dashboard_summary(
  start_date TEXT,
  end_date TEXT
)
RETURNS JSON AS $$
DECLARE
  v_start TIMESTAMPTZ;
  v_end TIMESTAMPTZ;
  v_total_orders INT;
  v_order_revenue NUMERIC(12, 2);
  v_total_expense NUMERIC(12, 2);
  v_total_income NUMERIC(12, 2);
  v_revenue NUMERIC(12, 2);
  v_weekly_revenue JSON;
  v_status_distribution JSON;
  v_result JSON;
BEGIN
  -- Parse input dates or default to current month
  v_start := COALESCE(start_date::TIMESTAMPTZ, date_trunc('month', NOW()));
  v_end := COALESCE(end_date::TIMESTAMPTZ, (date_trunc('month', NOW()) + INTERVAL '1 month - 1 second'));

  -- 1. Total Orders count
  SELECT COUNT(*)::INT INTO v_total_orders
  FROM public.orders
  WHERE delivery_date BETWEEN v_start::DATE AND v_end::DATE;

  -- 2. Order Revenue (Sum of delivered orders' prices)
  SELECT COALESCE(SUM(price), 0.00) INTO v_order_revenue
  FROM public.orders
  WHERE status = 'DELIVERED' AND delivery_date BETWEEN v_start::DATE AND v_end::DATE;

  -- 3. Total Expense (from finance_transactions joined with finance_categories)
  SELECT COALESCE(SUM(t.amount), 0.00) INTO v_total_expense
  FROM public.finance_transactions t
  JOIN public.finance_categories c ON t.category_id = c.id
  WHERE c.type = 'EXPENSE' AND t.date BETWEEN v_start::DATE AND v_end::DATE;

  -- 4. Total Income (from finance_transactions joined with finance_categories)
  SELECT COALESCE(SUM(t.amount), 0.00) INTO v_total_income
  FROM public.finance_transactions t
  JOIN public.finance_categories c ON t.category_id = c.id
  WHERE c.type = 'INCOME' AND t.date BETWEEN v_start::DATE AND v_end::DATE;

  -- 5. Calculate overall revenue (order revenue + other incomes)
  v_revenue := v_order_revenue + v_total_income;

  -- 6. Weekly Revenue (using extract week)
  WITH weekly_rev AS (
    SELECT 
      EXTRACT(WEEK FROM delivery_date) AS week_num,
      SUM(price) AS rev
    FROM public.orders
    WHERE status = 'DELIVERED' AND delivery_date BETWEEN v_start::DATE AND v_end::DATE
    GROUP BY EXTRACT(WEEK FROM delivery_date)
    ORDER BY week_num ASC
  ),
  weekly_with_idx AS (
    SELECT 
      'Tuần ' || row_number() over ()::TEXT AS week,
      rev AS revenue
    FROM weekly_rev
  )
  SELECT json_agg(json_build_object('week', week, 'revenue', revenue)) INTO v_weekly_revenue
  FROM weekly_with_idx;

  IF v_weekly_revenue IS NULL THEN
    v_weekly_revenue := '[]'::JSON;
  END IF;

  -- 7. Status Distribution
  WITH status_dist AS (
    SELECT 
      status,
      COUNT(*)::INT AS count
    FROM public.orders
    WHERE delivery_date BETWEEN v_start::DATE AND v_end::DATE
    GROUP BY status
    ORDER BY count DESC
  )
  SELECT json_agg(json_build_object('status', status, 'count', count)) INTO v_status_distribution
  FROM status_dist;

  IF v_status_distribution IS NULL THEN
    v_status_distribution := '[]'::JSON;
  END IF;

  -- Build final JSON
  v_result := json_build_object(
    'totalOrders', v_total_orders,
    'totalExpense', v_total_expense,
    'totalProfit', (v_revenue - v_total_expense),
    'revenue', v_revenue,
    'weeklyRevenue', v_weekly_revenue,
    'statusDistribution', v_status_distribution
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql STABLE;


-- ============================================================================
-- SEED DATA SETUP
-- ============================================================================

INSERT INTO public.finance_categories (name, type) VALUES
('FLOWER_STOCK', 'EXPENSE'),
('PACKAGING_SUPPLIES', 'EXPENSE'),
('EMPLOYEE_SALARY', 'EXPENSE'),
('MARKETING', 'EXPENSE'),
('REFUND', 'EXPENSE'),
('ORDER_PAYMENT', 'INCOME')
ON CONFLICT (name) DO NOTHING;
