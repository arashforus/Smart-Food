ALTER TABLE settings
ADD COLUMN IF NOT EXISTS show_menu_instagram BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS show_menu_whatsapp BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS show_menu_telegram BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS show_menu_language_selector BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS show_menu_theme_switcher BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS menu_default_theme TEXT DEFAULT 'light',
ADD COLUMN IF NOT EXISTS menu_background_type TEXT DEFAULT 'default',
ADD COLUMN IF NOT EXISTS menu_background_color TEXT,
ADD COLUMN IF NOT EXISTS menu_gradient_start TEXT,
ADD COLUMN IF NOT EXISTS menu_gradient_end TEXT,
ADD COLUMN IF NOT EXISTS menu_background_image TEXT;
ADD COLUMN IF NOT EXISTS show_menu BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS show_all_menu_item BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS show_recommended_menu_item BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS show_food_type BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS show_search_bar BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS show_view_switcher BOOLEAN NOT NULL DEFAULT true;

-- Record this migration as applied
INSERT INTO schema_versions (version, description)
VALUES ('016-add-menu-page-settings', 'Add theme and background settings for the menu page')
ON CONFLICT (version) DO NOTHING;
