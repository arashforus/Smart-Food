ALTER TABLE languages ADD COLUMN IF NOT EXISTS native_name TEXT DEFAULT '';
ALTER TABLE languages ADD COLUMN IF NOT EXISTS direction TEXT DEFAULT 'ltr';
ALTER TABLE languages ADD COLUMN IF NOT EXISTS flag_image TEXT;
ALTER TABLE languages ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false;

-- Record this migration as applied
INSERT INTO schema_versions (version, description)
VALUES ('007-add-language-fields', 'Add direction, native name, and flag image fields to languages table')
ON CONFLICT (version) DO NOTHING;
