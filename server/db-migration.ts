import { Pool } from "pg";
import { readFileSync } from "fs";
import { join } from "path";

interface MigrationVersion {
  version: string;
  description: string;
}

const MIGRATIONS: MigrationVersion[] = [
  { version: "001-initial-schema", description: "Initial database schema with all tables" },
  { version: "002-add-user-fields", description: "Add avatar and branch_id fields to users table" },
  { version: "003-add-phone-to-users", description: "Add phone field to users table" },
  { version: "004-add-language-to-users", description: "Add language field to users table" },
  { version: "005-add-missing-user-columns", description: "Add missing name, email, role, and language columns to users table" },
  { version: "006-add-general-name-to-categories", description: "Add general_name field to categories table" },
  { version: "007-add-language-fields", description: "Add native_name, direction, flag_image, and is_default fields to languages table" },
  { version: "008-add-icon-color-to-food-types", description: "Add icon and color columns to food_types table" },
  { version: "009-add-general-name-to-food-types", description: "Add general_name column to food_types table" },
  { version: "010-add-owner-fields-to-branches", description: "Add owner and owner_phone columns to branches table" },
  { version: "011-add-settings-table", description: "Add settings table for application configuration" },
  { version: "012-add-login-settings", description: "Add login page customization settings to settings table" },
  { version: "013-add-restaurant-settings", description: "Add restaurant information settings to settings table" },
  { version: "014-add-restaurant-socials", description: "Add restaurant social media settings to settings table" },
  { version: "015-add-qr-code-settings", description: "Add QR code customization settings to settings table" },
  { version: "016-add-menu-page-settings", description: "Add menu page customization settings to settings table" },
  { version: "017-add-menu-items-settings", description: "Add menu items display settings to settings table" },
  { version: "018-add-missing-settings-fields", description: "Add missing settings fields (operating hours, QR page, menu display)" },
  { version: "019-add-payment-roles-license-oss-fields", description: "Add payment, roles, license, and order status styling fields to settings table" },
  { version: "020-add-analytics-table", description: "Add analytics table for tracking visits and dashboard metrics" },
  { version: "021-add-qr-customization-fields", description: "Add QR code customization fields to settings table" },
  { version: "022-add-menu-display-settings", description: "Add menu display toggle settings to settings table" },
  { version: "023-add-kd-display-settings", description: "Add kitchen display toggle settings to settings table" },
  { version: "024-add-general-name-to-items", description: "Add general_name column to items table" },
];

export async function runDatabaseMigrations() {
  if (!process.env.DATABASE_URL) {
    console.log("No DATABASE_URL set - skipping migrations");
    return;
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log("🔄 Starting database migrations...");

    // Create schema_versions table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_versions (
        id SERIAL PRIMARY KEY,
        version TEXT NOT NULL UNIQUE,
        applied_at TIMESTAMP NOT NULL DEFAULT NOW(),
        description TEXT
      );
    `);

    // Get all applied migrations
    const result = await pool.query(
      "SELECT version FROM schema_versions ORDER BY applied_at"
    );
    const appliedVersions = new Set(result.rows.map((row) => row.version));

    console.log(`📊 Currently applied migrations: ${appliedVersions.size}`);
    if (appliedVersions.size > 0) {
      appliedVersions.forEach((v) => console.log(`   ✓ ${v}`));
    }

    // Find pending migrations
    const pendingMigrations = MIGRATIONS.filter(
      (m) => !appliedVersions.has(m.version)
    );

    if (pendingMigrations.length === 0) {
      console.log("✅ All migrations already applied!");
      return;
    }

    console.log(`\n⏳ Found ${pendingMigrations.length} pending migration(s):`);
    pendingMigrations.forEach((m) => console.log(`   → ${m.version}`));

    // Apply pending migrations in order
    for (const migration of pendingMigrations) {
      console.log(`\n🚀 Applying migration: ${migration.version}`);

      try {
        const sqlPath = join(process.cwd(), "server", "migrations", `${migration.version}.sql`);
        const sql = readFileSync(sqlPath, "utf-8");

        await pool.query(sql);

        console.log(`✅ Migration applied successfully: ${migration.version}`);
      } catch (error) {
        console.error(
          `❌ Failed to apply migration ${migration.version}:`,
          error
        );
        throw error;
      }
    }

    console.log("\n✨ All migrations completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await pool.end();
  }
}
