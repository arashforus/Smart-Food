-- Migration 036: Ensure license_key column exists in settings

ALTER TABLE settings ADD COLUMN IF NOT EXISTS license_key TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS license_owner TEXT;

INSERT INTO schema_versions (version, description)
VALUES ('036-add-license-key-if-not-exists', 'Ensure license_key and license_owner columns exist in settings table')
ON CONFLICT (version) DO NOTHING;
