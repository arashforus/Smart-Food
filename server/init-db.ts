import { Pool } from "pg";
import { runDatabaseMigrations } from "./db-migration";

export async function initializeDatabase() {
  if (!process.env.DATABASE_URL) {
    console.log("No DATABASE_URL set - using in-memory storage");
    return;
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log("🗄️ Initializing database...");

    // Run all pending migrations
    await runDatabaseMigrations();

    // Insert default settings if not exists
    await pool.query(`
      INSERT INTO settings (id, primary_color) 
      VALUES ('default', '#4CAF50')
      ON CONFLICT (id) DO NOTHING;
    `);

    // Insert admin user if not exists
    await pool.query(`
      INSERT INTO users (username, password, name, email, role) 
      VALUES ('admin', 'admin123', 'John Admin', 'admin@restaurant.com', 'admin')
      ON CONFLICT (username) DO NOTHING;
    `);

    console.log("✅ Database initialization completed successfully!");
  } catch (error) {
    console.error("⚠️ Database initialization error:", error);
    console.error("Note: If this is a connection error, check your DATABASE_URL");
  } finally {
    await pool.end();
  }
}
