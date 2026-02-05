ALTER TABLE settings ADD COLUMN menu_logo_show_background boolean NOT NULL DEFAULT false;
ALTER TABLE settings ADD COLUMN menu_logo_background_type text NOT NULL DEFAULT 'square';
ALTER TABLE settings ADD COLUMN menu_logo_background_color_light text NOT NULL DEFAULT '#ffffff';
ALTER TABLE settings ADD COLUMN menu_logo_background_color_dark text NOT NULL DEFAULT '#1a1a1a';
