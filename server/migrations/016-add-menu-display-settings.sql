-- Add menu display settings to settings table
ALTER TABLE settings
ADD COLUMN IF NOT EXISTS show_menu BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS show_all_menu_item BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS show_recommended_menu_item BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS show_food_type BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS show_search_bar BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS show_view_switcher BOOLEAN NOT NULL DEFAULT true;

-- Record this migration as applied
INSERT INTO schema_versions (version, description)
VALUES ('016-add-menu-display-settings', 'Add menu display settings to settings table')
ON CONFLICT (version) DO NOTHING;
