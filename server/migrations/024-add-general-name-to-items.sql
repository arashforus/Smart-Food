-- Migration: 024-add-general-name-to-items
-- Description: Add general_name column to items table
-- Date: 2026-01-12

ALTER TABLE items ADD COLUMN IF NOT EXISTS general_name TEXT NOT NULL DEFAULT '';
