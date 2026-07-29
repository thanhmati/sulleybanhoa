-- Migration: 02_create_store_settings_table.sql
-- Description: Create store_settings table for dynamic store content & configuration

CREATE TABLE IF NOT EXISTS public.store_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to store settings
CREATE POLICY "Allow public read access to store_settings"
  ON public.store_settings
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert, update, delete store settings
CREATE POLICY "Allow authenticated users to manage store_settings"
  ON public.store_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Setup trigger for updated_at
CREATE TRIGGER update_store_settings_updated_at
  BEFORE UPDATE ON public.store_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
