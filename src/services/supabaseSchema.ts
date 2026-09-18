export const SUPABASE_SQL_SCHEMA = `-- ========================================================
-- LA HOUSE - ESQUEMA DE BASE DE DATOS SUPABASE (POSTGRESQL)
-- Copiá y pegá este código en el SQL Editor de tu proyecto Supabase
-- ========================================================

-- 1. Tabla de Perfiles / Usuarios
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  pin TEXT NOT NULL DEFAULT '1234',
  avatar_color TEXT DEFAULT '#F97316',
  role TEXT DEFAULT 'owner',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de Sabores
CREATE TABLE IF NOT EXISTS flavors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  color TEXT DEFAULT '#F97316',
  category TEXT DEFAULT 'Tartas Dulces',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de Stock e Insumos
CREATE TABLE IF NOT EXISTS stock (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL, -- 'ready_tarta' | 'packaging' | 'supply'
  name TEXT NOT NULL,
  flavor_id TEXT REFERENCES flavors(id) ON DELETE SET NULL,
  quantity NUMERIC NOT NULL DEFAULT 0,
  min_threshold NUMERIC NOT NULL DEFAULT 5,
  unit TEXT DEFAULT 'unidades',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabla de Clientes (CRM)
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  total_orders INT DEFAULT 0,
  total_spent NUMERIC DEFAULT 0,
  favorite_flavor_ids JSONB DEFAULT '[]'::jsonb,
  last_order_date TIMESTAMPTZ,
  debt NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabla de Pedidos y Ventas
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number SERIAL,
  client_id TEXT REFERENCES clients(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'pending', -- 'paid' | 'pending' | 'partial'
  payment_method TEXT DEFAULT 'cash', -- 'cash' | 'transfer' | 'card'
  amount_paid NUMERIC DEFAULT 0,
  debt_amount NUMERIC DEFAULT 0,
  delivery_status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  delivery_date DATE NOT NULL,
  delivery_time TEXT,
  delivery_address TEXT,
  notes TEXT DEFAULT '',
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tabla de Gastos
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL, -- 'insumos' | 'packaging' | 'servicios' | 'otros'
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  date DATE NOT NULL,
  payment_method TEXT DEFAULT 'cash',
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Configuración del Negocio
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT 'main_settings',
  business_name TEXT DEFAULT 'La House Tartas',
  business_phone TEXT DEFAULT '',
  payment_alias TEXT DEFAULT '',
  payment_cbu TEXT DEFAULT '',
  currency_symbol TEXT DEFAULT '$',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- HABILITAR REALTIME EN TODAS LAS TABLAS
-- ========================================================
ALTER PUBLICATION supabase_realtime ADD TABLE profiles, flavors, stock, clients, orders, expenses, settings;

-- Habilitar RLS permisivo para uso personal
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE flavors ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public full access for app" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access for app" ON flavors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access for app" ON stock FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access for app" ON clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access for app" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access for app" ON expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access for app" ON settings FOR ALL USING (true) WITH CHECK (true);
`;
