-- Migration: 024-add-general-name-to-items
-- Description: Add general_name column to items table
-- Date: 2026-01-12

ALTER TABLE items ADD COLUMN IF NOT EXISTS general_name TEXT NOT NULL DEFAULT '';

-- Record this migration as applied
INSERT INTO schema_versions (version, description)
VALUES ('024-add-general-name-to-items', 'Add internal general name to items for administration')
ON CONFLICT (version) DO NOTHING;
