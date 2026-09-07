-- ============================================================
-- DashMatrix — Multi-country orders: orders_togo
-- ============================================================

CREATE TABLE IF NOT EXISTS orders_togo (
  id BIGSERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL DEFAULT '',
  customer_email TEXT DEFAULT '',
  customer_phone TEXT DEFAULT '',
  address TEXT DEFAULT '',
  city TEXT DEFAULT '',
  items JSONB DEFAULT '[]',
  total NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE orders_togo ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS orders_togo_anon_read ON orders_togo;
DROP POLICY IF EXISTS orders_togo_anon_insert ON orders_togo;
DROP POLICY IF EXISTS orders_togo_anon_update ON orders_togo;
DROP POLICY IF EXISTS orders_togo_anon_delete ON orders_togo;

CREATE POLICY orders_togo_anon_read ON orders_togo FOR SELECT USING (true);
CREATE POLICY orders_togo_anon_insert ON orders_togo FOR INSERT WITH CHECK (true);
CREATE POLICY orders_togo_anon_update ON orders_togo FOR UPDATE USING (true);
CREATE POLICY orders_togo_anon_delete ON orders_togo FOR DELETE USING (true);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders_togo'
      AND column_name = 'id'
      AND COALESCE(column_default, '') NOT LIKE 'nextval(%'
  ) THEN
    CREATE SEQUENCE IF NOT EXISTS orders_togo_id_seq;
    ALTER TABLE orders_togo ALTER COLUMN id SET DEFAULT nextval('orders_togo_id_seq'::regclass);
    PERFORM setval('orders_togo_id_seq', COALESCE(MAX(id), 0) + 1, false) FROM orders_togo;
  END IF;
END $$;
