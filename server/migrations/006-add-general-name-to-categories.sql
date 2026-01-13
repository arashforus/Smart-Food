ALTER TABLE categories ADD COLUMN IF NOT EXISTS general_name TEXT NOT NULL DEFAULT '';

-- Record this migration as applied
INSERT INTO schema_versions (version, description)
VALUES ('006-add-general-name-to-categories', 'Add general_name column to categories table')
ON CONFLICT (version) DO NOTHING;
