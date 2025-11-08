import { pgTable, uuid, varchar, text, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { user } from "./auth";
import { STOCK_STATUS } from "./constants";

/* ----------- Products ----------- */
export const product = pgTable("product", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  brand: varchar("brand", { length: 100 }).notNull(),
  productType: varchar("product_type", { length: 50 }).notNull(),
  status: varchar("status", { length: 20 }).default("active").notNull(),
  stockStatus: varchar("stock_status", { length: 50 })
    .default(STOCK_STATUS.IN_STOCK)
    .notNull(),
  originalPrice: decimal("original_price", {
    precision: 10,
    scale: 2,
  }).notNull(),
  salePrice: decimal("sale_price", { precision: 10, scale: 2 }),
  hasDiscount: boolean("has_discount").default(false).notNull(),
  stock: integer("stock").default(0).notNull(),
  hasWarranty: boolean("has_warranty").default(false).notNull(),
  warrantyPeriod: integer("warranty_period"),
  warrantyDetails: text("warranty_details"),
  slug: varchar("slug", { length: 300 }).notNull().unique(),
  metaTitle: varchar("meta_title", { length: 300 }),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),
  structuredData: text("structured_data"),
  sku: varchar("sku", { length: 100 }).unique(),
  upc: varchar("upc", { length: 50 }),
  // FK to Better Auth user table
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

/* ----------- Product Category ----------- */
export const productCategory = pgTable("product_category", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  productId: uuid("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  category: varchar("category", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 300 }),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ----------- Product Image ----------- */
export const productImage = pgTable("product_image", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  productId: uuid("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  alt: text("alt"),
  title: text("title"),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productSeoClick = pgTable("product_seo_click", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  productId: uuid("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  query: text("query").notNull(),
  position: integer("position"),
  clickedAt: timestamp("clicked_at").defaultNow().notNull(),
});

export const featuredProduct = pgTable("featured_product", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  productId: uuid("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 20 }).default("active").notNull(), // 'active' or 'inactive'
  userId: text("user_id") // Admin who added the featured product
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});