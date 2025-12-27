ALTER TABLE settings
ADD COLUMN IF NOT EXISTS restaurant_instagram TEXT,
ADD COLUMN IF NOT EXISTS restaurant_whatsapp TEXT,
ADD COLUMN IF NOT EXISTS restaurant_telegram TEXT,
ADD COLUMN IF NOT EXISTS restaurant_google_maps_url TEXT;
