// lib/db-server.ts
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from '@/db/schema'; // 👈 import your schema here

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const dbServer = drizzle({
  client: pool,
  schema, // 👈 register your schema
});

// ✅ Optional: export schema-aware type
export type Database = typeof dbServer;
