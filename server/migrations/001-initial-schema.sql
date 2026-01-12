-- Migration: 001-initial-schema
-- Description: Initial database schema with all tables
-- Date: 2025-01-01

-- Schema Version Tracking Table
CREATE TABLE IF NOT EXISTS schema_versions (
  id SERIAL PRIMARY KEY,
  version TEXT NOT NULL,
  applied_at TIMESTAMP NOT NULL DEFAULT NOW(),
  description TEXT,
  CONSTRAINT schema_versions_version_unique UNIQUE (version)
);

--ALTER TABLE schema_versions
--ADD CONSTRAINT schema_versions_version_unique UNIQUE (version);

-- Branches Table
CREATE TABLE IF NOT EXISTS branches (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Users Table (with avatar and branchId)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'chef',
  avatar TEXT,
  phone TEXT,
  branch_id VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT users_username_unique UNIQUE (username)
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name JSONB NOT NULL,
  image TEXT,
  "order" NUMERIC NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Food Types Table
CREATE TABLE IF NOT EXISTS food_types (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name JSONB NOT NULL,
  description JSONB NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  "order" NUMERIC NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Materials Table
CREATE TABLE IF NOT EXISTS materials (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name JSONB NOT NULL,
  icon TEXT,
  color TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  "order" NUMERIC NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Items Table
CREATE TABLE IF NOT EXISTS items (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id VARCHAR NOT NULL,
  name JSONB NOT NULL,
  short_description JSONB NOT NULL,
  long_description JSONB NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  discounted_price NUMERIC(10, 2),
  max_select NUMERIC,
  image TEXT,
  available BOOLEAN NOT NULL DEFAULT TRUE,
  suggested BOOLEAN NOT NULL DEFAULT FALSE,
  materials TEXT[] DEFAULT '{}',
  types TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tables Table
CREATE TABLE IF NOT EXISTS tables (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number TEXT NOT NULL,
  branch_id VARCHAR NOT NULL,
  capacity NUMERIC NOT NULL,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'available',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL,
  table_number VARCHAR,
  branch_id VARCHAR NOT NULL,
  items JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount NUMERIC(10, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT orders_order_number_unique UNIQUE (order_number)
);

-- Waiter Requests Table
CREATE TABLE IF NOT EXISTS waiter_requests (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id VARCHAR,
  branch_id VARCHAR,
  status TEXT NOT NULL DEFAULT 'pending',
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Languages Table
CREATE TABLE IF NOT EXISTS languages (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  "order" NUMERIC NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT languages_code_unique UNIQUE (code)
);

-- Session Table for express-session
CREATE TABLE IF NOT EXISTS "session" (
  "sid" VARCHAR NOT NULL COLLATE "default" PRIMARY KEY,
  "sess" JSON NOT NULL,
  "expire" TIMESTAMP(6) NOT NULL
) WITH (OIDS=FALSE);

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");

-- Record this migration as applied
INSERT INTO schema_versions (version, description)
VALUES ('001-initial-schema', 'Initial database schema with all tables')
ON CONFLICT ON CONSTRAINT schema_versions_version_unique DO NOTHING;
