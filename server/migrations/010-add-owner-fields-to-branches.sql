-- Migration: 010-add-owner-fields-to-branches
-- Description: Add owner and owner_phone columns to branches table
-- Date: 2025-12-25

ALTER TABLE branches ADD COLUMN IF NOT EXISTS owner TEXT,
ADD COLUMN IF NOT EXISTS owner_phone TEXT;

-- Record this migration as applied
INSERT INTO schema_versions (version, description)
VALUES ('010-add-owner-fields-to-branches', 'Add owner and owner_phone columns to branches table')
ON CONFLICT (version) DO NOTHING;
