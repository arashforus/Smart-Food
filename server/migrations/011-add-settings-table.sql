CREATE TABLE IF NOT EXISTS settings (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_color TEXT NOT NULL DEFAULT '#4CAF50',
  timezone TEXT NOT NULL DEFAULT 'UTC',
  favicon TEXT,
  currency_name TEXT NOT NULL DEFAULT 'US Dollar',
  currency_symbol TEXT NOT NULL DEFAULT '$',
  license_key TEXT,
  license_expiry_date TIMESTAMP,
  default_language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP DEFAULT NOW()
);