-- Migration 017: Add Restaurant Display Toggles to Menu Page Settings
ALTER TABLE settings
ADD COLUMN show_restaurant_logo BOOLEAN DEFAULT true,
ADD COLUMN show_restaurant_name BOOLEAN DEFAULT true,
ADD COLUMN show_restaurant_description BOOLEAN DEFAULT true,
ADD COLUMN show_restaurant_hours BOOLEAN DEFAULT true;
