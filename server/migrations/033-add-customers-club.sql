-- Migration 033: Add Customers Club table

CREATE TABLE IF NOT EXISTS customers_club (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  points INTEGER NOT NULL DEFAULT 0,
  birthday TEXT,
  branch_id VARCHAR,
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  joined_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO schema_versions (version, description)
VALUES ('033-add-customers-club', 'Add customers club table')
ON CONFLICT (version) DO NOTHING;
