import { pgTable, uuid, text, varchar, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { user } from "./auth";
import { product } from "./product";

export const wishlist = pgTable("wishlist", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 200 }).default("My Wishlist").notNull(),
  visibility: varchar("visibility", { length: 20 })
    .default("private")
    .notNull(), // private | public
  shareToken: varchar("share_token", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const wishlistItem = pgTable("wishlist_item", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  wishlistId: uuid("wishlist_id")
    .notNull()
    .references(() => wishlist.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  note: text("note"),
  priceAtAdd: decimal("price_at_add", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").default(true).notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});