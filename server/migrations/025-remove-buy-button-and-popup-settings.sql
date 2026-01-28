-- Migration: Remove show_buy_button and show_more_information_popup columns from settings table
-- These columns are being removed as they are no longer needed

ALTER TABLE settings
DROP COLUMN IF EXISTS show_buy_button,
DROP COLUMN IF EXISTS show_more_information_popup;
