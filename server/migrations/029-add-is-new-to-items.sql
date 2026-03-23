-- Migration 029: Add is_new column to items table
ALTER TABLE items ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT false;
