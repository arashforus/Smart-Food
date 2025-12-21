import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { users, waiterRequests } from "../shared/schema";

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  try {
    console.log("Creating tables...");
    
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

    console.log("Tables created successfully!");

    console.log("Inserting admin user...");
    
    // Insert admin user
    await pool.query(`
      INSERT INTO users (username, password, name, email, role) 
      VALUES ('admin', 'admin123', 'John Admin', 'admin@restaurant.com', 'admin')
      ON CONFLICT (username) DO NOTHING;
    `);

    console.log("Admin user inserted successfully!");
    console.log("✅ Database seeded! You can now login with:");
    console.log("   Username: admin");
    console.log("   Password: admin123");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
