import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { sql } from "drizzle-orm";

export const pageView = pgTable("page_view", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  url: text("url").notNull(),
  referrer: text("referrer"),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const searchQuery = pgTable("search_query", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  query: text("query").notNull(),
  resultCount: integer("result_count").notNull(),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});