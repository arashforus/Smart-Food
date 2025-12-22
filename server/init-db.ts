import { Pool } from "pg";

export async function initializeDatabase() {
  if (!process.env.DATABASE_URL) {
    console.log("No DATABASE_URL set - using in-memory storage");
    return;
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log("Initializing database...");

    // Create session table for express-session
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default" PRIMARY KEY,
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL
      ) WITH (OIDS=FALSE);
    `);

    // Create index on expire column for cleanup
    await pool.query(`
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" on "session" ("expire");
    `);

    // Insert admin user if not exists
    await pool.query(`
      INSERT INTO users (username, password, name, email, role) 
      VALUES ('admin', 'admin123', 'John Admin', 'admin@restaurant.com', 'admin')
      ON CONFLICT (username) DO NOTHING;
    `);

    console.log("✅ Database initialized successfully!");
  } catch (error) {
    console.error("⚠️ Database initialization error:", error);
    console.error("Note: If this is a connection error, check your DATABASE_URL");
  } finally {
    await pool.end();
  }
}
