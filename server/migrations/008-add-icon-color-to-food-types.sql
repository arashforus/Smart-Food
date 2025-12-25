-- Migration: 008-add-icon-color-to-food-types
-- Description: Add icon and color columns to food_types table
-- Date: 2025-12-25

ALTER TABLE food_types
ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT 'leaf',
ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#4CAF50';

-- Record this migration as applied
INSERT INTO schema_versions (version, description)
VALUES ('008-add-icon-color-to-food-types', 'Add icon and color columns to food_types table')
ON CONFLICT (version) DO NOTHING;
