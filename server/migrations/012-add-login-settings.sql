-- Add login page customization settings to settings table
ALTER TABLE settings
ADD COLUMN IF NOT EXISTS login_background_image TEXT,
ADD COLUMN IF NOT EXISTS show_login_title BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS login_title TEXT NOT NULL DEFAULT 'Welcome',
ADD COLUMN IF NOT EXISTS show_login_reset_password BOOLEAN NOT NULL DEFAULT true;
