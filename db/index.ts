import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@/db/schema"; // Import all tables here

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });
