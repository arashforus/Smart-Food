ALTER TABLE settings
ADD COLUMN IF NOT EXISTS restaurant_name TEXT,
ADD COLUMN IF NOT EXISTS restaurant_description TEXT,
ADD COLUMN IF NOT EXISTS restaurant_address TEXT,
ADD COLUMN IF NOT EXISTS restaurant_phone TEXT,
ADD COLUMN IF NOT EXISTS restaurant_email TEXT,
ADD COLUMN IF NOT EXISTS restaurant_hours TEXT,
ADD COLUMN IF NOT EXISTS restaurant_logo TEXT,
ADD COLUMN IF NOT EXISTS restaurant_background_image TEXT,
ADD COLUMN IF NOT EXISTS restaurant_map_lat NUMERIC,
ADD COLUMN IF NOT EXISTS restaurant_map_lng NUMERIC;

-- Record this migration as applied
INSERT INTO schema_versions (version, description)
VALUES ('013-add-restaurant-settings', 'Add restaurant profile and contact settings')
ON CONFLICT (version) DO NOTHING;
