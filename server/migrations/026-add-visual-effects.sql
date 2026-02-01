-- Migration 026: Add smoke_effect, fire_effect, and ice_effect to items table
ALTER TABLE items ADD COLUMN IF NOT EXISTS smoke_effect BOOLEAN DEFAULT false;
ALTER TABLE items ADD COLUMN IF NOT EXISTS fire_effect BOOLEAN DEFAULT false;
ALTER TABLE items ADD COLUMN IF NOT EXISTS ice_effect BOOLEAN DEFAULT false;