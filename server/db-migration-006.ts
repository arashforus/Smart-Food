import { sql } from "drizzle-orm";

export const migration_006 = sql`
  ALTER TABLE categories ADD COLUMN IF NOT EXISTS general_name TEXT NOT NULL DEFAULT '';
`;
