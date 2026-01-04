-- Migration: Add QR customization fields to settings table
ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "qr_eye_border_color" text NOT NULL DEFAULT '#000000';
ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "qr_eye_border_shape" text NOT NULL DEFAULT 'square';
ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "qr_eye_dot_color" text NOT NULL DEFAULT '#000000';
ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "qr_eye_dot_shape" text NOT NULL DEFAULT 'square';
ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "qr_dots_style" text NOT NULL DEFAULT 'square';
ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "qr_center_types" text NOT NULL DEFAULT 'none';
ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "qr_center_text" text;
ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "qr_logo" text;
