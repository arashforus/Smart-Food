-- Add language field to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en';

-- Record this migration as applied
INSERT INTO schema_versions (version, description)
VALUES ('004-add-language-to-users', 'Add language field to users table')
ON CONFLICT (version) DO NOTHING;
