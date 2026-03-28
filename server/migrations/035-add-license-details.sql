-- Migration 035: Add license detail columns to settings

ALTER TABLE settings ADD COLUMN IF NOT EXISTS license_expiry TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS license_email TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS license_phone TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS license_type TEXT;

INSERT INTO schema_versions (version, description)
VALUES ('035-add-license-details', 'Add license email, phone, type, and expiry text columns to settings')
ON CONFLICT (version) DO NOTHING;
