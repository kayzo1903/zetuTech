import { pgTable, uuid, text, integer, timestamp  } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { product } from "./product";
import { user } from "./auth";

export const productReview = pgTable("product_review", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: uuid("product_id").notNull().references(() => product.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
