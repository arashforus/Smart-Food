ALTER TABLE settings
ADD COLUMN IF NOT EXISTS restaurant_instagram TEXT,
ADD COLUMN IF NOT EXISTS restaurant_whatsapp TEXT,
ADD COLUMN IF NOT EXISTS restaurant_telegram TEXT,
ADD COLUMN IF NOT EXISTS restaurant_google_maps_url TEXT;

-- Record this migration as applied
INSERT INTO schema_versions (version, description)
VALUES ('014-add-restaurant-socials', 'Add social media links to restaurant settings')
ON CONFLICT (version) DO NOTHING;
