// db/schema/maintenanceLogs.ts - Simplified version
import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const maintenanceLogs = pgTable("maintenance_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  adminEmail: text("admin_email").notNull(),
  newState: boolean("new_state").notNull(),
  note: text("note").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});