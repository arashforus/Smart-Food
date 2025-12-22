-- Add language field to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en';
