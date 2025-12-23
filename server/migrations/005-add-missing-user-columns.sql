-- Migration: 005-add-missing-user-columns
-- Description: Add missing name, email, role, and language columns to users table

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS email TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'chef',
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en';

ALTER TABLE branches
ADD COLUMN IF NOT EXISTS owner TEXT,
ADD COLUMN IF NOT EXISTS owner_phone TEXT;

INSERT INTO schema_versions (version, description)
VALUES ('005-add-missing-user-columns', 'Add missing name, email, role, and language columns to users table')
ON CONFLICT (version) DO NOTHING;
