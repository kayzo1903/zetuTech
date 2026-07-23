import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: text("type").notNull(), // "support" | "contact"
  ticketId: text("ticket_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").default("open"), // used for support only: open/pending/resolved
  createdAt: timestamp("created_at").defaultNow(),
});
