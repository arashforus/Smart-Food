-- Add phone and created_at fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

-- Record this migration as applied
INSERT INTO schema_versions (version, description)
VALUES ('003-add-phone-to-users', 'Add phone and created_at fields to users table')
ON CONFLICT (version) DO NOTHING;
