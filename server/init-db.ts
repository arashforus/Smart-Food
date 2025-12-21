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

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        username text UNIQUE NOT NULL,
        password text NOT NULL,
        name text NOT NULL DEFAULT '',
        email text NOT NULL DEFAULT '',
        role text NOT NULL DEFAULT 'chef',
        created_at timestamp DEFAULT now()
      );
    `);

    // Add missing columns if they don't exist
    const columnsToAdd = [
      { name: 'name', type: 'text NOT NULL DEFAULT \'\'', check: `
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'name'
      ` },
      { name: 'email', type: 'text NOT NULL DEFAULT \'\'', check: `
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'email'
      ` },
      { name: 'role', type: 'text NOT NULL DEFAULT \'chef\'', check: `
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'role'
      ` },
    ];

    for (const col of columnsToAdd) {
      const checkResult = await pool.query(col.check);
      if (checkResult.rows.length === 0) {
        console.log(`Adding missing column: ${col.name}`);
        await pool.query(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type};`);
      }
    }

    // Create waiter_requests table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS waiter_requests (
        id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        table_id varchar,
        branch_id varchar,
        status text DEFAULT 'pending',
        timestamp timestamp DEFAULT now()
      );
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
