-- Add QR code customization settings to settings table
ALTER TABLE settings
ADD COLUMN IF NOT EXISTS qr_show_logo BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS qr_show_title BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS qr_show_description BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS qr_show_animated_text BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS qr_animated_texts TEXT[] NOT NULL DEFAULT ARRAY['Welcome', 'Discover our Menu']::text[],
ADD COLUMN IF NOT EXISTS qr_media_url TEXT,
ADD COLUMN IF NOT EXISTS qr_media_type TEXT,
ADD COLUMN IF NOT EXISTS qr_text_color TEXT NOT NULL DEFAULT '#000000',
ADD COLUMN IF NOT EXISTS qr_show_call_waiter BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS qr_show_address_phone BOOLEAN NOT NULL DEFAULT true;

-- Record this migration as applied
INSERT INTO schema_versions (version, description)
VALUES ('015-add-qr-code-settings', 'Add QR code customization settings to settings table')
ON CONFLICT (version) DO NOTHING;
