-- Migration: 002-add-user-fields
-- Description: Add avatar and branch_id fields to users table
-- Date: 2025-01-02
-- Note: This is a reference migration. If running from v1.0, use migration 001 instead.

-- Add avatar column if it doesn't exist
ALTER TABLE users
ADD COLUMN IF NOT EXISTS avatar TEXT;

-- Add branch_id column if it doesn't exist
ALTER TABLE users
ADD COLUMN IF NOT EXISTS branch_id VARCHAR;

-- Record this migration as applied
INSERT INTO schema_versions (version, description)
VALUES ('002-add-user-fields', 'Add avatar and branch_id fields to users table')
ON CONFLICT (version) DO NOTHING;
