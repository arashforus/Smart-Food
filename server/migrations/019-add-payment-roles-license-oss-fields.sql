-- Migration 019: Add Payment, Roles, License, and Order Status Styling fields

-- Payment tab: Payment Method
ALTER TABLE settings
ADD COLUMN IF NOT EXISTS payment_method TEXT;

-- Roles tab: 8 permission and access fields
ALTER TABLE settings
ADD COLUMN IF NOT EXISTS roles_admin_permissions TEXT,
ADD COLUMN IF NOT EXISTS roles_admin_setting_access TEXT,
ADD COLUMN IF NOT EXISTS roles_manager_permissions TEXT,
ADD COLUMN IF NOT EXISTS roles_manager_setting_access TEXT,
ADD COLUMN IF NOT EXISTS roles_chef_permissions TEXT,
ADD COLUMN IF NOT EXISTS roles_chef_setting_access TEXT,
ADD COLUMN IF NOT EXISTS roles_accountant_permissions TEXT,
ADD COLUMN IF NOT EXISTS roles_accountant_setting_access TEXT;

-- License tab: License Owner (if not already added by migration 018)
ALTER TABLE settings
ADD COLUMN IF NOT EXISTS license_owner TEXT;

-- OSS tab: Order Status Styling (14 fields)
ALTER TABLE settings
ADD COLUMN IF NOT EXISTS oss_pending_color VARCHAR(7) DEFAULT '#FFA500',
ADD COLUMN IF NOT EXISTS oss_preparing_color VARCHAR(7) DEFAULT '#1E90FF',
ADD COLUMN IF NOT EXISTS oss_ready_color VARCHAR(7) DEFAULT '#32CD32',
ADD COLUMN IF NOT EXISTS oss_background_type TEXT DEFAULT 'solid',
ADD COLUMN IF NOT EXISTS oss_background_color VARCHAR(7) DEFAULT '#FFFFFF',
ADD COLUMN IF NOT EXISTS oss_background_image TEXT,
ADD COLUMN IF NOT EXISTS oss_card_text_color VARCHAR(7) DEFAULT '#000000',
ADD COLUMN IF NOT EXISTS oss_card_border_color VARCHAR(7) DEFAULT '#CCCCCC',
ADD COLUMN IF NOT EXISTS oss_card_box_style TEXT DEFAULT 'flat',
ADD COLUMN IF NOT EXISTS oss_header_text TEXT,
ADD COLUMN IF NOT EXISTS oss_number_label TEXT,
ADD COLUMN IF NOT EXISTS oss_table_label TEXT,
ADD COLUMN IF NOT EXISTS oss_show_table_information BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS oss_show_status_icon BOOLEAN DEFAULT true;

-- Record this migration as applied
INSERT INTO schema_versions (version, description)
VALUES ('019-add-payment-roles-license-oss-fields', 'Add payment methods, roles, licensing, and OSS configuration')
ON CONFLICT (version) DO NOTHING;
