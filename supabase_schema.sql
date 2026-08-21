-- ==============================================================================
-- EAGLE BOOKS - SUPABASE DATABASE SCHEMA & PERMISSIONS SETUP
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ==============================================================================

-- 1. Create Customers Table
CREATE TABLE IF NOT EXISTS public.customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    jewellery_shop TEXT,
    phone TEXT,
    address TEXT,
    type TEXT DEFAULT 'typeJewelleryShop',
    custom_type TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migrations for existing tables
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS jewellery_shop TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS custom_type TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS notes TEXT;

-- 2. Create Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
    id TEXT PRIMARY KEY,
    customer_id TEXT REFERENCES public.customers(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    type TEXT NOT NULL,
    item_name TEXT,
    weight NUMERIC DEFAULT 0,
    touch_percent NUMERIC DEFAULT 100,
    wastage_percent NUMERIC DEFAULT 0,
    cash_amount NUMERIC,
    rate_per_gram NUMERIC,
    converted_grams NUMERIC,
    is_touch_adjusted BOOLEAN DEFAULT FALSE,
    direction TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Silver Rates Table
CREATE TABLE IF NOT EXISTS public.silver_rates (
    id TEXT PRIMARY KEY DEFAULT 'current_rate',
    rate_per_gram NUMERIC DEFAULT 95,
    rate_per_kg NUMERIC DEFAULT 95000,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial silver rate if not present
INSERT INTO public.silver_rates (id, rate_per_gram, rate_per_kg, last_updated)
VALUES ('current_rate', 95, 95000, NOW())
ON CONFLICT (id) DO NOTHING;

-- 4. GRANT EXPLICIT PERMISSIONS TO ANON AND AUTHENTICATED ROLES
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- 5. Enable Row Level Security (RLS) & Open Public Access Policies
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.silver_rates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public access for customers" ON public.customers;
CREATE POLICY "Public access for customers" ON public.customers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for transactions" ON public.transactions;
CREATE POLICY "Public access for transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for silver_rates" ON public.silver_rates;
CREATE POLICY "Public access for silver_rates" ON public.silver_rates FOR ALL USING (true) WITH CHECK (true);

-- 6. Enable Realtime Replication
ALTER PUBLICATION supabase_realtime ADD TABLE public.customers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.silver_rates;
