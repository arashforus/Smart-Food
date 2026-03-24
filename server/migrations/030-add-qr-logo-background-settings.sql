ALTER TABLE settings ADD COLUMN qr_logo_show_background boolean NOT NULL DEFAULT false;
ALTER TABLE settings ADD COLUMN qr_logo_background_type text NOT NULL DEFAULT 'square';
ALTER TABLE settings ADD COLUMN qr_logo_background_color text NOT NULL DEFAULT '#ffffff';
