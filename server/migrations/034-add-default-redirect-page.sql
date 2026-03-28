-- Migration 034: Add default redirect page to settings

ALTER TABLE settings ADD COLUMN IF NOT EXISTS default_redirect_page TEXT NOT NULL DEFAULT 'main';

INSERT INTO schema_versions (version, description)
VALUES ('034-add-default-redirect-page', 'Add default redirect page setting to control root URL destination')
ON CONFLICT (version) DO NOTHING;
