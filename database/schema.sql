CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('reception', 'quality', 'xrf', 'huid', 'manager', 'admin');
CREATE TYPE article_status AS ENUM (
  'intake_pending',
  'intake_complete',
  'quality_pending',
  'quality_passed',
  'xrf_pending',
  'xrf_complete',
  'huid_pending',
  'huid_stamped',
  'delivered'
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  mobile TEXT UNIQUE,
  email TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  address TEXT,
  gst_number TEXT,
  discount_tier TEXT NOT NULL DEFAULT 'regular',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  intake_user_id UUID REFERENCES users(id),
  article_type TEXT NOT NULL,
  declared_purity TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  gross_weight NUMERIC(12, 3) NOT NULL,
  net_weight NUMERIC(12, 3),
  discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status article_status NOT NULL DEFAULT 'intake_complete',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE article_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  image_type TEXT NOT NULL,
  storage_url TEXT NOT NULL,
  captured_by UUID REFERENCES users(id),
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE quality_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  checked_by UUID REFERENCES users(id),
  decision TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE xrf_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  machine_code TEXT NOT NULL,
  tested_by UUID REFERENCES users(id),
  au_percent NUMERIC(6, 3) NOT NULL,
  ag_percent NUMERIC(6, 3),
  cu_percent NUMERIC(6, 3),
  result TEXT NOT NULL,
  report_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE huid_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID NOT NULL UNIQUE REFERENCES articles(id) ON DELETE CASCADE,
  huid_code TEXT NOT NULL UNIQUE,
  assigned_by UUID REFERENCES users(id),
  manak_push_status TEXT NOT NULL DEFAULT 'pending',
  manak_reference TEXT,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE licences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  licence_name TEXT NOT NULL,
  licence_number TEXT NOT NULL,
  expires_on DATE NOT NULL,
  reminder_days INTEGER NOT NULL DEFAULT 30,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE calibration_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  machine_code TEXT NOT NULL,
  calibration_date DATE NOT NULL,
  expires_on DATE NOT NULL,
  certificate_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_user_id UUID REFERENCES users(id),
  actor_role user_role,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  before_data JSONB,
  after_data JSONB,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_customer_id ON articles(customer_id);
CREATE INDEX idx_huid_records_huid_code ON huid_records(huid_code);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
