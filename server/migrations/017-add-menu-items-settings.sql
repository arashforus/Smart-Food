-- Add menu items display settings to settings table
ALTER TABLE settings
ADD COLUMN IF NOT EXISTS show_buy_button BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS show_more_information_popup BOOLEAN NOT NULL DEFAULT true;
