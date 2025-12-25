-- Migration: 009-add-general-name-to-food-types
-- Description: Add general_name column to food_types table
-- Date: 2025-12-25

ALTER TABLE food_types ADD COLUMN IF NOT EXISTS general_name TEXT NOT NULL DEFAULT '';

-- Record this migration as applied
INSERT INTO schema_versions (version, description)
VALUES ('009-add-general-name-to-food-types', 'Add general_name column to food_types table')
ON CONFLICT (version) DO NOTHING;
