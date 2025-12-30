-- Migration 018: Add all missing settings fields to database
-- Restaurant tab: operating hours
ALTER TABLE settings
ADD COLUMN IF NOT EXISTS operating_hours TEXT;

-- QR Page tab: page title and description
ALTER TABLE settings
ADD COLUMN IF NOT EXISTS qr_page_title TEXT,
ADD COLUMN IF NOT EXISTS qr_page_description TEXT;

-- QR Design: foreground and background colors
ALTER TABLE settings
ADD COLUMN IF NOT EXISTS qr_foreground_color VARCHAR(7) DEFAULT '#000000',
ADD COLUMN IF NOT EXISTS qr_background_color VARCHAR(7) DEFAULT '#FFFFFF';

-- Menu Page: display toggles (with menu_ prefix)
ALTER TABLE settings
ADD COLUMN IF NOT EXISTS menu_show_prices BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS menu_show_images BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS menu_show_ingredients BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS menu_show_food_types BOOLEAN DEFAULT true;
