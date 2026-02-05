-- Migration: 027-add-currency-decimal-to-settings
ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "currency_decimal" integer DEFAULT 2 NOT NULL;
